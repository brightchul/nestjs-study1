import { Controller, Get, NotFoundException, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { CommonService } from './common.service';
import { AuthGuard } from './auth/auth.guard';

// 가드 적용 컨트롤러 레벨
// @UseGuards(AuthGuard)
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly commonService: CommonService,
    private readonly configService: ConfigService,
  ) {}

  // 가드 적용 메서드 레벨
  // @UseGuards(AuthGuard)
  @Get()
  getHello(): string {
    return (
      this.appService.getHello() +
      process.env.DATABASE_HOST +
      this.configService.get('DATABASE_HOST')
    );
  }

  @Get('/common-hello')
  getCommonHello(): string {
    return this.commonService.hello();
  }
}
