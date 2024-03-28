import { BadRequestException, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from './entities/post.entity';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { CommonModule } from 'src/common/common.module';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import * as multer from 'multer';
import { POST_IMAGE_PATH } from 'src/common/const/path.const';
import { v4 as uuid } from 'uuid';
import { ImageModel } from 'src/common/entities/image.entity';
import { PostImagesService } from './image/images.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostsModel, ImageModel]),
    JwtModule.register({}),
    UsersModule,
    CommonModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, AuthService, PostImagesService],
})
export class PostsModule {}
