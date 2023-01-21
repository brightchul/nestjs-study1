import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ApiController } from './api/api.controller';
import { UsersController } from './users/users.controller';
import { EmailService } from './email/email.service';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from './users/users.service';
import { CoreModule } from './core.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CoreModule,
    UsersModule,
  ],
  controllers: [ApiController, AppController],
  providers: [AppService],
})
export class AppModule {}
