import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuard } from './auth/auth.guard';
import { ErrorsInterceptor } from './interceptor/errors.interceptor';
import { LogginInterceptor } from './interceptor/logging.interceptor';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { logger3 } from './middleware/logger.middleware';

// import * as dotenv from 'dotenv';
// import * as path from 'path';
// import { getEnvPath } from 'src/config/env';

// ConfigModule.forRoot({envFilePath}) 둘중 하나만 해도 된다
// dotenv.config({
//   path: path.resolve(getEnvPath()),
// });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 전역으로 미들웨어를 적용하기 위함
  // app.use(logger3);

  // 가드 전역 레벨로 적용
  // app.useGlobalGuards(new AuthGuard());

  // 전역으로 설정할때 사용하는 방법
  // class-transformer 적용하기 위해 true 설정
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // 전역으로 interceptor 적용
  app.useGlobalInterceptors(
    new LogginInterceptor(),
    new TransformInterceptor(),
    // new ErrorsInterceptor(),   // 모든 에러에 대한 인터셉터, 예외 필터에서 다루는게 더 나을수 있다.
  );

  await app.listen(3000);
}
bootstrap();
