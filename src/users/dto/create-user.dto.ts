import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { NotIn } from './not-in';

/*
- 사용자 이름은 2~30자 이하 문자열
- 사용자 이메일은 60자 이하의 문자열로서 이메일 주소 형식
- 사용자 패스워드는 영문대소문자, 숫자, 특수문자로 이뤄진 8~30자 이하 문자열
*/

export class CreateUserDto {
  // name에 대해서 공백 제거 처리를 해준다.
  @Transform((params) => params.value.trim())
  // @Transform(({ value, obj }) => {
  //   // password 체크
  //   if (obj.password.includes(obj.name.trim())) {
  //     throw new BadRequestException(
  //       'password는 name과 같은 문자열을 포함할 수 없습니다.',
  //     );
  //   }
  //   return value.trim();
  // })
  // 위의 Transform과 동일하다.
  @NotIn('password', {
    message: 'password는 name과 같은 문자열을 포함할 수 없습니다',
  })
  @Transform((params) => {
    console.log(params);
    return params.value;
  })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  readonly name: string;

  @IsString()
  @IsEmail()
  @MaxLength(60)
  readonly email: string;

  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}/)
  readonly password: string;
}
