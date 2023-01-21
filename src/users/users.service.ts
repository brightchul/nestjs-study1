import { Injectable } from '@nestjs/common';

import { EmailService } from 'src/email/email.service';
import * as uuid from 'uuid';
import { UserInfo } from './UserInfo';

@Injectable()
export class UsersService {
  constructor(private emailService: EmailService) {}

  async getUserInfo(userId: string): Promise<UserInfo> {
    // 1. userId를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러 처리
    // 2. 조회된 데이터를 UserInfo타입으로 응답
    return {} as UserInfo;

    throw new Error('Method not implemented');
  }

  async login(email: string, password: string): Promise<string> {
    // 1. email, password를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러
    // 2. JWT 발급
    throw new Error('Method not implemented');
  }

  async verifyEmail(signupVerifyToken: string): Promise<string> {
    // 1. DB 에서 signupVerifyToken 으로 회원 가입 처리중인 유저가 있는지 조회하고 없다면 에러 처리
    // 2. 바로 로그인 상태가 되도록 JWT 발급

    throw new Error('Method not implemented');
  }

  async createUser(name: string, email: string, password: string) {
    await this.checkUserExists(email);
    const signupVerifyToken = uuid.v1();

    await this.saveUser(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  // TODO: DB 연동 후 구현
  private checkUserExists(email: string) {
    return false;
  }

  // TODO: DB 연동 후 구현
  private saveUser(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    return;
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }
}
