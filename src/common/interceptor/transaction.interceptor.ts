import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, tap } from 'rxjs';
import { DataSource } from 'typeorm';

@Injectable()
export class TranactionInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();

    const qr = this.dataSource.createQueryRunner(); // 쿼리 러너 생성 : 쿼리를 묶어주는 역할

    await qr.connect();

    await qr.startTransaction(); // 쿼리 러너를 사용하면 트랙잭션 안에서 데이터베이스 액션을 실행 할 수 있음

    req.queryRunner = qr;

    return next.handle().pipe(
      catchError(async (err) => {
        await qr.rollbackTransaction();
        await qr.release();

        throw new InternalServerErrorException(err.message);
      }),
      tap(async () => {
        await qr.commitTransaction();
        await qr.release();
      }),
    );
  }
}
