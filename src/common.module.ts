import { Module } from '@nestjs/common';
import { CommonService } from './common.service';

// @Global() 전역 모듈 데코레이터
@Module({
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
