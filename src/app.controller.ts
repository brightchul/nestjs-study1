import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { CommonService } from './common.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly commonService: CommonService,
    private readonly configService: ConfigService,
  ) {}

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
