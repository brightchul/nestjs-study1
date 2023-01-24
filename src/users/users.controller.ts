import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Headers,
  UseGuards,
  UseFilters,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { HttpExceptionFilter } from 'src/exception/http.exception.filter';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserInfo } from './UserInfo';
import { UsersService } from './users.service';
import { ValidationPipe } from './validation.pipe';

@Controller('users')
@UseFilters(HttpExceptionFilter) // 컨트롤러에 적용할 때
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  // 커스텀 ValidationPipe적용하는 방법
  // async createUser(@Body(ValidationPipe) dto: CreateUserDto): Promise<void> {
  @UseFilters(HttpExceptionFilter) // 메서드에 적용할 때
  @Post()
  async createUser(@Body(ValidationPipe) dto: CreateUserDto): Promise<void> {
    const { name, email, password } = dto;
    await this.usersService.createUser(name, email, password);
  }

  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;

    return await this.usersService.verifyEmail(signupVerifyToken);
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;
    return await this.usersService.login(email, password);
  }

  // @Get('/:id')
  // async getUserInfo(@Param('id') userId: string): Promise<UserInfo> {
  //   return await this.usersService.getUserInfo(userId);
  // }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async getUserInfo(
    @Headers() headers: any,
    @Param('id') userId: string,
  ): Promise<UserInfo> {
    return await this.usersService.getUserInfo(userId);
  }
}
