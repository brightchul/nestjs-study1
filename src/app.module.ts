import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ApiController } from './api/api.controller';
import { UsersController } from './users/users.controller';
import { EmailService } from './email/email.service';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [ApiController, AppController, UsersController],
  providers: [AppService, UsersService, EmailService],
})
export class AppModule {}
