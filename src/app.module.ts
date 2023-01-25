import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { getEnvPath } from 'src/config/env';
import { ApiController } from './api/api.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import authConfig from './config/authConfig';
import emailConfig from './config/emailConfig';
import { validationSchema } from './config/validationSchema';
import { CoreModule } from './core.module';
import { ExceptionModule } from './exception/exception.module';
import {
  LoggerMiddleware,
  LoggerMiddleware2,
} from './middleware/logger.middleware';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { InterceptorModule } from './interceptor/interceptor.module';
import { BatchModule } from './batch/batch.module';

@Module({
  imports: [
    CoreModule,
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: [getEnvPath()],
      load: [emailConfig, authConfig],
      isGlobal: true,
      validationSchema,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.DB_SYNCHRONIZE === 'true', // 구동시 소스코드 기반 동기화할지 여부,  prod는 금지
    }),
    ExceptionModule,
    InterceptorModule,
    BatchModule,
  ],
  controllers: [ApiController, AppController],
  providers: [
    AppService,
    // 10.2 가드에 종속성 주입을 사용해서 다른 프로바이더를 주입시 커스텀 프로바이더로 선언
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // apply에 미들웨어 여러개 추가 가능
    // consumer.apply(LoggerMiddleware, LoggerMiddleware2).forRoutes('/users');
    // 아래처럼 Controller Class도 가능
    consumer
      .apply(LoggerMiddleware, LoggerMiddleware2)
      .exclude({ path: '/users/hello', method: RequestMethod.GET }) // 제외할 라우팅 경로
      .forRoutes(UsersController);
  }
}
