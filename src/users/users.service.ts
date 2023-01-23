import { DataSource, Repository } from 'typeorm';
import { ulid } from 'ulid';
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as uuid from 'uuid';

import { AuthService } from 'src/auth/auth.service';
import { EmailService } from 'src/email/email.service';
import { UserEntity } from './user.entity';
import { UserInfo } from './UserInfo';

@Injectable()
export class UsersService {
  constructor(
    private emailService: EmailService,
    private datasource: DataSource,
    private authService: AuthService,

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async getUserInfo(userId: string): Promise<UserInfo> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  async login(email: string, password: string): Promise<string> {
    // 1. email, password를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러
    // 2. JWT 발급
    throw new Error('Method not implemented');
  }

  async verifyEmail(signupVerifyToken: string): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { signupVerifyToken },
    });

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email,
    });
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
