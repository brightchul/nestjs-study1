# Chapter12 모든 것은 항상 실패한다: 예외 필터

## Nest에서 제공하는 표준 예외

https://developer.mozilla.org/ko/docs/Web/HTTP/Status/404

- BadRequestException
- UnauthorizedException
- NotFoundException
- ForbiddenException
- NotAcceptableException
- RequestTimeoutException
- ConflictException
- GoneException
- HttpVersionNotSupportedException
- PayloadTooLargeException
- UnsupportedMediaTypeException
- UnprocessableEntityException
- InternalServerErrorException
- NotImplementedException
- ImATeapotException
- MethodNotAllowedException
- BadGatewayException
- ServiceUnavailableException
- GatewayTimeoutException
- PreconditionFailedException

## 예외 필터

Nest에서 제공하는 전역 예외 필터 외에 직접 예외 필터 레이어를 둬서 원하는대로 예외를 다룰수 있다. 예외가 일어났을 때 로그를 남기거나 응답 개체를 원하는 대로 변경하고자 하는 등의요구 사항을 해결하고자 할 때 사용한다. 



## 부트스트랩 과정에서 전역 필터 적용

- 부트스트랩 과정에서 전역 필터를 적용하는 방식은 필터에 의존성을 주입할수 없다는 제약이 있다.
- 예외 필터의 수행이 예외가 발생한 모듈 외부(main.ts)에서 이뤄지기 때문이다.

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter()); // 전역 필터 사용
  await app.listen(3000);
}
bootstrap();
```

- 의존성 주입을 받고자 한다면 예외 필터를 커스텀 프로바이더로 등록하면 된다.

```typescript

import { Logger, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './http.exception.filter';

@Module({
  providers: [Logger, { provide: APP_FILTER, useClass: HttpExceptionFilter }],
})
export class ExceptionModule {}

// 이후 app module import에  등록
```