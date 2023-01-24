import { HttpException, HttpStatus } from '@nestjs/common';

// HttpException을 상속받은 예외 클래스를 직접 만든다고 하면..
// throw new CustomRequestError('~~~ 요청이 잘못되었습니다.', 'id format exception')
export class CustomRequestError extends HttpException {
  constructor(
    objectOrError?: string | object | any,
    description = 'CustomRequestError',
  ) {
    super(
      HttpException.createBody(
        objectOrError,
        description,
        HttpStatus.BAD_REQUEST,
      ),
      HttpStatus.BAD_REQUEST,
    );
  }
}
