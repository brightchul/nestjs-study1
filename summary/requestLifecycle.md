# 요청 생명 주기

요총 샹묭 주가 (reqest lifecycle) 혹은 요청/응답 생명 주기는 들어온 요청이 어떤 컴포넌트를 거쳐서 처리되고, 생성된 응답은 또 어떤 컴포넌트를 거쳐 처리되는지를 말한다. 어떤 프레임워크를 사용하더라도 요청/응답 생명주기를 알아두는 것은 중요하다. 

## 미들 웨어

미들웨어의 실행 순서는 정해져 있다. 먼저 전역으로 ㅂ인딩된 미들웨어를 실행한다. 이후는 모듈에 바인딩 되는 순서대로 실행한다. 다른 모듈에 바인딩되어 있는 미들웨어들이 있으면 먼저 루트 모듈에 바인딩된 미들웨어를 실행하고, imports에 정의된 순서대로 실행된다.

## 가드

가드 역시 전역으로 바인딩된 가드를 먼저 시작한다. 그리고 컨트롤러에 정의된 순서대로 실행된다. 

```typescript
// Guard1, Guard2, Guard3 순으로 시ㅏㄹ행된다.
@UseGuards(Guard1, Guard2)
@Controller("users")
export class UsersController {
  consstructor(private usersService: UsersService) {}

  @UseGuards(Guard3)
  @Get()
  getUsers(): Users[] }
  return this.usersService.getUsers();
}
```

## 인터셉터

인터셉터의 실행 순서는 가드와ㅓ 유사하다. 다만 인터셉터는 RxJS의 Observable 객체를 반환하는데 이는 요청의 실행 순서와 반대 순서로 동작한다는 점이다. 
- 요청 :  `전역 -> 컨트롤러 -> 라우터` 순서대로 동작
- 응답 :  `라우터 -> 컨트롤러 -> 전역` 순서대로 동작


## 파이프

파이프는 동작하는 순서가 조금 독특하다. 파이프가 여러 레벨에 적용되어 있다면 이전과 마찬가지 순서대로 적용한다. 특이한 점ㅁ은 파이프가 적용된 라우터의 매개변수가 여러 개 있을 때는 정의한 순서의역순으로 적용된다는 점이다. 

```typescript
@UsePipes(GeneralValidationPipe)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UsePipes(RouteSpecifiPipe)
  @Patch(":id")
  updateUser(
    @Body() body UpdateUserDto,
    @Param() params: UpdateUserParams,
    @Query() query: UpdateUserQuery
  ) {
    return this.usersService.updateUser(body, params, query);
  }
}
```

여기서 순서는 GeneralValidationPipe -> RouteSpecifiPipe 순으로 간다
하지만 이들 파이프를 각각 적용하는 updateUser의 매개변수는 query -> params -> body 의 순서대로 적용된다. 

즉 GeneralValidationPipe 가 먼저  query -> params -> body 순서대로 적용되고 
이후 RouteSpecifiPipe 에서 query -> params -> body 순서대로 적용된다. 

## 예외 필터

- 필터는 유일하ㅔ 전역 필터가 먼저 적용되지 않는다.
= 라우터 -> 컨트롤러 -> 전역으로 바인딩된 순서대로 동작한다.
= 참고로 필터가 예외를 잡으면 catch 다른 필터가 동일한 예외를 잡을 수 없다.
