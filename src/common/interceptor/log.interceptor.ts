import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map, tap } from 'rxjs';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    /**
     * 요청이 들어올 때, req 요청이 들어온 타임스탬프를 찍음
     * [REQ] {요청 path} {요청 시간}
     *
     * 응답할 때, 타임스탬프를 찍음
     * [RES] {요청 path} {응답 시간} {걸린 시간 ms}
     */

    const now = new Date();

    const req = context.switchToHttp().getRequest();

    const path = req.originalUrl;

    console.log(`[REQ] ${path} ${now.toLocaleString('kr')}`);

    // 라우트의 로직이 전부 실행되고 응답이 observable로 반환됨
    return next.handle().pipe(
      // tap으로 모니터링 가능
      tap((observable) =>
        console.log(
          `[RES] ${path} ${new Date().toLocaleString('kr')} ${new Date().getMilliseconds() - now.getMilliseconds()}ms`,
        ),
      ),
      // map으로 응답 변형 가능
      //   map((observable) => {
      //     return {
      //       message: '응답',
      //       response: observable,
      //     };
      //   }),
    );
  }
}
