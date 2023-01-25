# Chapter14 태스크 스케줄링

서비스를 개발하다 보면 주기적으로 동일한 작업을 처리해야 하는 경우가 생긴다. 
이러한 주기적 반복 작업을 task 또는 batch 라고 부른다. 태스크 스케줄링을 잘 활용하면 특정 기간마다 수행해야 하는 귀찮은 작업을 신경쓰지 않아도 된다.

리눅스에는 태스크 스케줄링을 담당하는 크론 cron 이라는 기능이 있다. Nest는 인기 패키지인 node-cron을 통합한 `@nestjs/schedule 패키지` 를 제공하며 이 패키지에 포함된 ScheduleModule을 사용한다. BatchModule을 사용하기도 한다.

ScheduleModule은 forRoot 메서드를 통해 가져오는데, 이 과정에서 Nest는 스케줄러를 초기화하고 앱에 선언된 크론 잡과 타임아웃, 인터벌을 등록한다. 타임아웃은 스케줄링이 끝나는 시각이고 인터벌은 주기적으로 반복되는 시간 간격을 뜻한다.

태스크 스케줄링은 모든 모듈이 예약된 작업을 로드하고 확인하는 onApplicationBootstrap 생명주기 훅이 발생할 때 등록된다.

## ScheduleModule에 테스트 등록 방법 3가지

### 크론 잡 선언 방식
크론 잡 선언 방식은 `@Cron` 데코레이터를 선언한 메서드를 태스크로 구현하는 방식

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  @Cron('* * * * * *', { name: 'cronTask' })
  handleCron() {
    this.logger.log('Tsk Called');
  }
}
```

`@Cron` 의 첫번째 인수는 태스크의 반복 주기로서 표준 크론 패턴을 따른다.
```
* * * * * *
| | | | | |
| | | | | └ day of week (요일, 0-7, 0와 7은 일요일)
| | | | └ month (월, 0-12의 값을 가짐, 0과 12는 12월)
| | | └ day of month (일, 1-31)
| | └ hour (시간, 0-23)
| └ minute (분, 0-59)
└ second (초, 0-59, 선택사항)
```

- ?(물음표) : 특정값이 없을 때(어떤값이든 상관X), 날짜와 요일에만 사용가능
- -(하이픈) : 범위값을 지정할 때
- ,(콤마) : 여러 값을 지정할 때
- /(슬러시) : 초기값과 증가치 설정할 때
- L(대문자 엘) : 지정할 수 있는 범위의 마지막 값 설정할 때, 날짜와 요일에만 사용가능
- W(대문자 더블유) : 월~금요일 또는 가장 가까운 월,금요일을 설정할 때
- #(샵) : 몇번째 특정요일을 설정할 때

|패턴|의지|
|------|---|
|* * * * * *|초마다|
|45 * * * * *|매분 45초에|
|0 10 * * * *|매시간 10분에|
|0 0/30 9-17 * * *|오전 9~오후5까지 30분마다|
|0 30 11 * 1-5|월요일~금요일 오전 11시 30분에|


`@Cron` 데코레이터의 두번째 인수는 CronOptions 객체이다. 

|속성|설명|
|------|---|
|name|태스크의 이름, 선언한 크론 잡에 액세스하고 이를 제어하는데 유용하다.|
|timeZone|실행 시간대를 지정한다. 시간대가 유효하지 않으면 오류가 발생한다. Moment Timezone 등의 웹페이지에서 사용 가능한 모든 시간대를 확인할 수 있다. 한국은 Asia/Seoul을 사용한다.|
|utcOffset|timeZone 대신 UTC 기반으로 시간대의 오프셋을 지정할수 있다. 한국은 `+09:00` 또는 9를 사용한다.|
|unrefTimeout|Node.js의 timeout.unref와 관련있다. 이벤트 루프를 계속 실행하는 코드가 있고 크론 잡의 상태에 관계없이 집이 완료될 때 노드 프로세스를 중지하고 싶을 때 사용할 수 있다.|

> timeZone 옵션과 utcOffset 옵션을 함께 사용하면 안된다! 이상 동작 일으킬 수 있다.

### 인터벌 선언 방식
`@Interval` 데코레이터를 사용할수 있다. 첫번째 인수는 태스크 이름, 두번째 인수는 타임 아웃(밀리세컨드) 이다.

```typescript
@Interval('intervalTask', 2000)
handleInterval() {
  this.logger.log('Task Called by interval 2 seconds');
}
```

### 타임아웃 선언방식

타임아웃 선언 방식은 앱이 실행된 후 태스크를 단 한번 만 수행한다. `@Timeout` 데코레이터를 사용하며 인수는 동일하다.

```typescript
@Timeout('timeoutTask', 4000)
handleTimeout() {
  this.logger.log('Task Called by timeout 4 seconds ============');
}
```

## 동적 태스크 스케줄링

위에서 다룬 태스크 등록 방식은 앱이 구동되는 과정에서 태스크가 등록되는 방식이다. 하지만 앱 구동 중 특정 조건을 만족했을 때 태스크를 등록해야 하는 요구사항이 있을수도 있다. 이를 위해서는 동적으로 태스크를 등록/해제할 방법이 필요하다. 동적 태스크 스케줄링은 SchedulerRegistry에서 제공하는 API를 사용한다.