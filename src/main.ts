import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true, // 자동으로 타입을 변환해서 받을 수 있게 함
      },
      whitelist: true, // 정의되지 않는 프로퍼티들은 삭제됨
      forbidNonWhitelisted: true, // 정의되지 않은 프로퍼티가 들어오면 에러 발생
    }),
  ); // 모든 클래스 validator 사용 가능

  await app.listen(3000);
}
bootstrap();
