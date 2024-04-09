import {
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RolesEnum } from './const/roles.const';
import { Roles } from './decorator/roles.decorator,';
import { UsersModel } from './entity/users.entity';
import { User } from './decorator/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(RolesEnum.ADMIN)
  /**
   * serialization : 직렬화, 현새 시스템에서 사용하는 데이터의 구조를 다른 시스템에서도 쉽게 사용할 수 잇는 포맷으로 변환
   *                  -> class의 object에서 JSON 포맷으로 변환
   * deserialization : 역직렬화
   */
  getUsers() {
    return this.usersService.getAllUsers();
  }

  @Get('follow/me')
  async getFollow(
    @User() user: UsersModel,
    @Query('includeConfirmed', new DefaultValuePipe(false), ParseBoolPipe)
    includeConfirmed: boolean,
  ) {
    return await this.usersService.getFollowers(user.id, includeConfirmed);
  }

  @Post('follow/:id')
  async postFollow(
    @User() user: UsersModel,
    @Param('id', ParseIntPipe) followeeId: number,
  ) {
    await await this.usersService.followUser(user.id, followeeId);

    return true;
  }

  @Patch('follow/:id/confirm')
  async patchFollowConfirm(
    @User() user: UsersModel,
    @Param('id', ParseIntPipe) followerId: number,
  ) {
    await this.usersService.confirmFollow(followerId, user.id);

    return true;
  }

  @Delete('follow/:id')
  async deleteFollow(
    @User() user: UsersModel,
    @Param('id', ParseIntPipe) followeeId: number,
  ) {
    await this.usersService.deleteFollow(user.id, followeeId);

    return true;
  }
  // @Post()
  // postUser(
  //   @Body('nickname') nickname: string,
  //   @Body('email') email: string,
  //   @Body('password') password: string,
  // ) {
  //   return this.usersService.creatUser({ nickname, email, password });
  // }
}
