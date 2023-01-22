import { DataSource, Repository } from 'typeorm';
import { ulid } from 'ulid';
import * as uuid from 'uuid';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EmailService } from 'src/email/email.service';
import { UserEntity } from './user.entity';
import { UserInfo } from './UserInfo';

@Injectable()
export class UsersService {
  constructor(
    private emailService: EmailService,
    private datasource: DataSource,

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

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
    if (await this.checkUserExists(email)) {
      throw new UnprocessableEntityException(
        '해당 이메일로는 가입할 수 없습니다.',
      );
    }
    try {
      const signupVerifyToken = uuid.v1();
      await this.saveUserWithTransaction(
        name,
        email,
        password,
        signupVerifyToken,
      );
      await this.sendMemberJoinEmail(email, signupVerifyToken);
    } catch (error) {
      throw error;
    }
  }

  private async checkUserExists(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    return user !== null;
  }

  private async saveUser(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    const user = new UserEntity();
    user.id = ulid();
    user.name = name;
    user.email = email;
    user.password = password;
    user.signupVerifyToken = signupVerifyToken;

    await this.userRepository.save(user);
  }

  private async saveUserWithTransaction(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ): Promise<void> {
    await this.datasource.transaction(async (manager) => {
      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await manager.save(user);
    });
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }
}
