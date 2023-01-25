import { Injectable, Logger } from '@nestjs/common';
import { CronJob } from 'cron';
import {
  Cron,
  Interval,
  Timeout,
  CronExpression,
  SchedulerRegistry,
} from '@nestjs/schedule';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(private schedulerRegistry: SchedulerRegistry) {
    this.addCrone();
  }

  addCrone() {
    const name = 'cronSample';
    const job = new CronJob('* * * * * *', () => {
      this.logger.warn(`run! ${name}`);
    });

    // 크론잡 하나를 schedulerRegistry에 추가한다. 하지만 이것은 태스크 스케줄링을 등록하는것이 아니다.
    this.schedulerRegistry.addCronJob(name, job);
    this.logger.warn(`job ${name} added!!!!`);
  }

  @Cron('* * * * * *', { name: 'cronTask' })
  handleCron() {
    this.logger.log('Tsk Called');
  }

  // 한번만 실행되는 task는 Date 객체로 직접 설정
  @Cron(new Date(Date.now() + 3 * 1000))
  handleOnceAfter3seconds() {
    this.logger.log('Run in 3 seconds');
  }

  // 자주 사용할만한 크론 패턴을 ConExpression 열거형으로 제공
  @Cron(CronExpression.MONDAY_TO_FRIDAY_AT_1AM)
  handle1AMCron() {
    this.logger.log('Run at 1AM');
  }

  // 인터벌 선언 방식
  @Interval('intervalTask', 2000)
  handleInterval() {
    this.logger.log('Task Called by interval 2 seconds');
  }

  // 타임 아웃 선언 방식
  @Timeout('timeoutTask', 4000)
  handleTimeout() {
    this.logger.log('Task Called by timeout 4 seconds ============');
  }
}
