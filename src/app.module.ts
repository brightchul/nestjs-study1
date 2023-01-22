import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getEnvPath } from 'src/config/env';

import { ApiController } from './api/api.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import emailConfig from './config/emailConfig';
import { validationSchema } from './config/validationSchema';
import { CoreModule } from './core.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [getEnvPath()],
      load: [emailConfig],
      isGlobal: true,
      validationSchema,
    }),
    CoreModule,
    UsersModule,
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
  ],
  controllers: [ApiController, AppController],
  providers: [AppService],
})
export class AppModule {}
