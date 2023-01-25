import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LogginInterceptor implements NestInterceptor {
  constructor(private logger: Logger) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    console.log('Before....');

    const now = Date.now();
    const { method, url, body } = context.getArgByIndex(0);
    this.logger.log(`Request to ${method} ${url}`);

    return next
      .handle() // handle을 호출해야  라우터 핸들러가 동작한다.
      .pipe(
        tap(() => this.logger.log(`After... ${Date.now() - now}ms`)),
        tap((data) =>
          this.logger.log(
            `Response from ${method} ${url} \n response" ${JSON.stringify(
              data,
            )}`,
          ),
        ),
      );
  }
}
