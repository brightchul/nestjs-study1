import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ApiController } from './api/api.controller';
import { UsersController } from './users/users.controller';
import { EmailService } from './email/email.service';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from './users/users.service';
import { CoreModule } from './core.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CoreModule,
  ],
  controllers: [ApiController, AppController, UsersController],
  providers: [AppService, UsersService, EmailService],
})
export class AppModule {}
