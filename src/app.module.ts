import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { ApiController } from './api/api.controller';

@Module({
  imports: [UsersModule],

  // 하위 도메인 라우팅시 먼저 와야 한다.
  controllers: [ApiController, AppController, UsersController],
  providers: [AppService, UsersService],
})
export class AppModule {}
