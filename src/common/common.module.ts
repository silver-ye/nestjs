import { BadRequestException, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import * as multer from 'multer';
import { TEMP_FOLDER_PATH } from './const/path.const';
import { v4 as uuid } from 'uuid';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({}),
    AuthModule,
    UsersModule,
    MulterModule.register({
      limits: {
        fileSize: 1000000, // 바이트 단위로 입력
      },
      fileFilter: (req, file, callback) => {
        /**
         * callback(에러, boolean)
         *
         * 에러 : 에러가 있을 경우, 에러 정보를 넣어준다.
         * boolean : 파일을 받을지 말지에 대한 boolean
         */
        const ext = extname(file.originalname);

        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
          return callback(
            new BadRequestException('jpg/jpeg/png 파일만 업로드 가능합니다.'),
            false,
          );
        }

        return callback(null, true);
      },
      storage: multer.diskStorage({
        destination: function (req, res, callback) {
          callback(null, TEMP_FOLDER_PATH);
        },
        filename: function (req, file, callback) {
          callback(null, `${uuid()}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
  controllers: [CommonController],
  providers: [CommonService, AuthService],
  exports: [CommonService],
})
export class CommonModule {}
