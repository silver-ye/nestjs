import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { User } from 'src/users/decorator/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { updatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { UsersModel } from 'src/users/entity/users.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageModelType } from 'src/common/entity/image.entity';
import { DataSource, QueryRunner as QR } from 'typeorm';
import { PostImagesService } from './image/images.service';
import { LogInterceptor } from 'src/common/interceptor/log.interceptor';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { QueryRunner } from 'src/common/decorator/query-runner-decorator';
import { HttpExceptionFilter } from 'src/common/exception-filter/http.exception-filter';
import { Roles } from 'src/users/decorator/roles.decorator,';
import { RolesEnum } from 'src/users/const/roles.const';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { IsPostMineOrAdminGuard } from './guard/is-post-mine-or-admin.guard';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postService: PostsService,
    private readonly postImagesService: PostImagesService,
    private readonly dataSource: DataSource,
  ) {}

  @Get()
  @IsPublic()
  // @UseInterceptors(LogInterceptor)
  getPosts(@Query() query: PaginatePostDto) {
    return this.postService.paginatePosts(query);
  }

  @Post('random')
  async postPostsRadom(@User() user: UsersModel) {
    await this.postService.generatePosts(user.id);

    return true;
  }

  @Get(':id')
  @IsPublic()
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postService.getPostById(id);
  }

  @Post()
  @UseInterceptors(TransactionInterceptor)
  async postPosts(
    @User('id') userId: number,
    @Body() body: CreatePostDto,
    @QueryRunner() qr: QR,
  ) {
    const post = await this.postService.creatPost(userId, body, qr);

    for (let i = 0; i < body.images.length; i++) {
      await this.postImagesService.createPostImage(
        {
          post,
          order: i,
          path: body.images[i],
          type: ImageModelType.POST_IMAGE,
        },
        qr,
      );
    }

    return this.postService.getPostById(post.id, qr);
  }

  @Patch(':postId')
  @UseGuards(IsPostMineOrAdminGuard)
  patchPost(
    @Param('postId', ParseIntPipe) id: number,
    @Body() body: updatePostDto,
  ) {
    return this.postService.updatePost(id, body);
  }

  @Delete(':id')
  @Roles(RolesEnum.ADMIN)
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postService.deletePost(id);
  }
}
