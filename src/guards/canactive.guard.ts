import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

// 예를 들어 사용자가 가입한 요금제에 따라 서비스에서 제공하는 기능이다를 경우
// 요청 객체에 포함된 정보(토큰)을 분석하여 사용자가 해당 기능을 사용할 수 있는지 판단
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    // false를 반환시 403 에러 발생
    // 다른 에러를 응답 반환으로 원할시에 다른 에러 생성우 던져야 한다.
    return this.validateRequest(request);
  }
  private validateRequest(request: any) {
    return true;
  }
}
