import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LogginInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    console.log('Before....');

    const now = Date.now();
    return next
      .handle() // handle을 호출해야  라우터 핸들러가 동작한다.
      .pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)));
  }
}
