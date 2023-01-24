import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch() // 처리되지 않은 모든 예외를 잡으려고 할 때 사용한다.
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: Logger) {} // 커스텀 프로바이더를 module에서 만들어서 의존성 주입가능

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    // 대부분의 예외는 Nest에서 HttpException을 상속받은 클래스들이다.
    // 이것이 아닌 예외는 알수 없는 예외므로 InternalServerErrorException으로 처리한다.
    if (!(exception instanceof HttpException)) {
      exception = new InternalServerErrorException();
    }

    const response = (exception as HttpException).getResponse();

    const log = {
      timestamp: new Date(),
      url: req.url,
      response,
    };

    this.logger.log(log);
    res.status((exception as HttpException).getStatus()).json(response);
  }
}
