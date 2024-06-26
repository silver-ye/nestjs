import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from 'src/users/entity/users.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { ConfigService } from '@nestjs/config';
import {
  ENV_HASH_ROUNDS,
  ENV_JWT_SECRET,
} from 'src/common/const/env-keys.const';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 토큰을 사용하게 되는 방식
   *
   * 1. 사용자가 로그인 또는 회원가입을 진행하면, accessToken과 refreshToken을 발급받는다.
   * 2. 로그인할 때는 Basic 토큰과 함께 요청을 보낸다.
   *    - Basic 토큰은 '이메일:비밀번호'를 Base64로 인코딩한 형태이다.
   *    ex) {authorization: 'Basic {token}'}
   * 3. 아무나 접근 할 수 없는 정보 (private route)를 접근할 때는,
   *    accessToken을 Header에서 추가해서 요청과 함께 보낸다.
   *    ex) {authorization: 'Bearer {token}'}
   * 4. 토큰과 요청을 함께 받은 서버는 토큰 검증을 통해 현재 요청을 보낸 사용자가 누구인지 알 수 있다.
   *    ex) 현재 로그인한 사용자가 작성한 포스트만 가져오려면, 토큰의 sub값에 입력되어있는
   *        사용자의 포스트만 따로 필터링할 수 있다.
   *        특정 사용자의 토큰이 없다면, 다른 사용자의 데이터를 접근할 수 없다.
   * 5. 모든 토큰은 만료 기간이 있다. 만료기간이 지나면 새로 토큰을 받아야한다.
   *    그렇지 않으면, JwtService.verify()에서 인증이 통과 안된다.
   *    그러니 access 토큰을 새로 발급받을 수 있는 /auth/token/access와
   *    refresh 토큰을 새로 발급받을 수 있는 /auth/token/refresh가 필요하다.
   *    설계에 따라서 refresh 토큰을 발급받지않고 로그아웃시켜서 새로 로그인 시킬 수 있다.
   * 6. 토큰이 만료되면 각각의 토큰을 새로 발급받을 수 있는 앤드포인트에 요청을 해서
   *    새로운 토큰을 발급받고 새로운 토큰을 사용해서 private route에 접근한다.
   */

  /**
   * Header로 부터 토큰을 받을 때
   *
   * {authorization: 'Basic {token}'}
   * {authorization: 'Bearer {token}'}
   *
   */
  extractTokenFromHeader(header: string, isBearer: boolean) {
    const splitToken = header.split(' ');

    const prefix = isBearer ? 'Bearer' : 'Basic';

    if (splitToken.length !== 2 || splitToken[0] !== prefix) {
      throw new UnauthorizedException('잘못된 토큰입니다.');
    }

    const token = splitToken[1];

    return token;
  }

  /**
   * email:password 형태로 바꾸고 이를 split해서
   * {email: email, password: password}로 반환
   */
  decodeBasicToken(base64String: string) {
    const decoded = Buffer.from(base64String, 'base64').toString('utf-8');

    const split = decoded.split(':');

    if (split.length !== 2) {
      throw new UnauthorizedException('잘못된 유형의 토큰입니다.');
    }

    const email = split[0];
    const password = split[1];

    return { email, password };
  }

  verifyToken(token: string) {
    // 토큰 검증
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>(ENV_JWT_SECRET),
      });
    } catch (e) {
      throw new UnauthorizedException('토큰이 만료됐거나 잘못된 토큰입니다.');
    }
  }

  /**
   * Payload 안에는
   * sub: id
   * email: email,
   * type: 'access' | 'refresh'
   */
  rotateToken(token: string, isRefreshToken: boolean) {
    const decoded = this.jwtService.verify(token, {
      secret: this.configService.get<string>(ENV_JWT_SECRET),
    });

    if (decoded.type !== 'refresh') {
      throw new UnauthorizedException(
        '토큰 재발급은 Refresh 토큰으로만 가능합니다.',
      );
    }

    return this.signToken(
      {
        ...decoded,
      },
      isRefreshToken,
    );
  }

  /**
   * 만들려는 기능
   *
   * 1. registerWithEmail
   *  - email, nickname, password를 입력받고 사용자를 생성함
   *  - 생성이 완료되면 accessToken과 refreshToken을 반환함
   *      - 회원 가입 후 다시 로그인해주세요 방지하기 위해서 반환함
   *
   * 2. loginWithEmail
   *  - email, password를 입력하면 사용자 검증을 진행
   *  - 검증이 완료되면 accessToken과 refreshToken을 반환함
   *
   * 3. loginUser
   *  - 1과 2에서 필요한 accessToken과 refreshToken을 반환하는 로직
   *
   * 4. signToken
   *    - 3에서 필요한 accessToken과 refreshToken을 sign하는 로직
   *
   * 5. authenticateWithEmailAndPaaword
   *    - 2에서 로그인 진행할 때, 필요한 기본적인 검증 진행
   *        1. 사용자가 존재하는지 확인(email 기반)
   *        2. 비밀번호가 맞는지 확인
   *        3. 모두 통과되면 찾은 사용자 정보 반환
   *        4. loginWithEmail에서 반환된 데이터를 기반으로 토큰 생성
   */

  /**
   * Payload에 들어갈 정보
   *
   * 1. email
   * 2. sub -> id
   * 3. type : 'access' | 'refresh
   *
   */
  signToken(user: Pick<UsersModel, 'email' | 'id'>, isRefreshToken: boolean) {
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? 'refresh' : 'access',
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>(ENV_JWT_SECRET),
      expiresIn: isRefreshToken ? 3600 : 300, // 초단위 입력
    });
  }

  loginUser(user: Pick<UsersModel, 'email' | 'id'>) {
    return {
      accessToken: this.signToken(user, false),
      refreshToken: this.signToken(user, true),
    };
  }

  async authenticateWithEmailAndPaaword(
    user: Pick<UsersModel, 'email' | 'password'>,
  ) {
    const existingUser = await this.userService.getUserByEmail(user.email);

    if (!existingUser) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');
    }

    /**
     * bcrypt 파라미터
     *
     * 1. 입력된 비밀번호
     * 2. 기존 해시(hash)
     */
    const passOk = await bcrypt.compare(user.password, existingUser.password);

    if (!passOk) {
      throw new UnauthorizedException('비밀번호가 틀렸습니다.');
    }

    return existingUser;
  }

  async loginWithEmail(user: Pick<UsersModel, 'email' | 'password'>) {
    const existingUser = await this.authenticateWithEmailAndPaaword(user);

    return this.loginUser(existingUser);
  }

  async registerWithEmail(user: RegisterUserDto) {
    const hash = await bcrypt.hash(
      user.password,
      parseInt(this.configService.get<string>(ENV_HASH_ROUNDS)),
    );

    const newUser = await this.userService.creatUser({
      ...user,
      password: hash,
    });

    return this.loginUser(newUser);
  }
}
