import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from './entity/users.entity';
import { QueryRunner, Repository } from 'typeorm';
import { UserFollwersModel } from './entity/user-followers.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
    @InjectRepository(UserFollwersModel)
    private readonly usersFollowsRepository: Repository<UserFollwersModel>,
  ) {}

  getUsersRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<UsersModel>(UsersModel)
      : this.usersFollowsRepository;
  }

  getUserFollowsRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<UserFollwersModel>(UserFollwersModel)
      : this.usersFollowsRepository;
  }

  async creatUser(user: Pick<UsersModel, 'nickname' | 'email' | 'password'>) {
    // 1. nickname 중복이 없는지 확인
    // exists() -> 만약에 조건에 해당하는 값이 있으면 true 반환
    const nicknameExists = await this.usersRepository.exists({
      where: {
        nickname: user.nickname,
      },
    });

    if (nicknameExists) {
      throw new BadRequestException('이미 존재하는 닉네임입니다.');
    }

    const emailExists = await this.usersRepository.exists({
      where: {
        email: user.email,
      },
    });

    if (emailExists) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }

    const userObject = this.usersRepository.create({
      nickname: user.nickname,
      email: user.email,
      password: user.password,
    });

    const newUser = await this.usersRepository.save(userObject);

    return newUser;
  }

  async getAllUsers() {
    return await this.usersRepository.find();
  }

  async getUserByEmail(email: string) {
    return this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }

  async followUser(followerId: number, followeeId: number, qr?: QueryRunner) {
    const usersFollowsRepository = this.getUserFollowsRepository(qr);

    await usersFollowsRepository.save({
      follower: {
        id: followerId,
      },
      followee: {
        id: followeeId,
      },
    });

    return true;
  }

  async getFollowers(userId: number, includeNotConfirmed: boolean) {
    const where = {
      followee: {
        id: userId,
      },
    };

    if (!includeNotConfirmed) {
      where['isConfirmed'] = true;
    }

    const result = await this.usersFollowsRepository.find({
      where,
      relations: {
        follower: true,
        followee: true,
      },
    });

    return result.map((x) => ({
      id: x.follower.id,
      nickname: x.follower.nickname,
      email: x.follower.email,
      isConfirmed: x.isConfirmed,
    }));
  }

  async confirmFollow(
    followerId: number,
    followeeId: number,
    qr?: QueryRunner,
  ) {
    const usersFollowsRepository = this.getUserFollowsRepository(qr);

    const existing = await usersFollowsRepository.findOne({
      where: {
        follower: {
          id: followerId,
        },
        followee: {
          id: followeeId,
        },
      },
      relations: {
        follower: true,
        followee: true,
      },
    });

    if (!existing) {
      throw new BadRequestException('존재하지않는 팔로우 요청입니다.');
    }

    await usersFollowsRepository.save({
      ...existing,
      isConfirmed: true,
    });

    return true;
  }

  async deleteFollow(followerId: number, followeeId: number, qr?: QueryRunner) {
    const usersFollowsRepository = this.getUserFollowsRepository(qr);

    await usersFollowsRepository.delete({
      follower: {
        id: followerId,
      },
      followee: {
        id: followeeId,
      },
    });

    return true;
  }

  async incrementFollowerCount(userId: number, qr?: QueryRunner) {
    const usersRepository = this.getUsersRepository(qr);

    await usersRepository.increment(
      {
        id: userId,
      },
      'followerCount',
      1,
    );
  }

  async decrementFollowerCount(userId: number, qr?: QueryRunner) {
    const usersRepository = this.getUsersRepository(qr);

    await usersRepository.decrement(
      {
        id: userId,
      },
      'followerCount',
      1,
    );
  }
}
