import { registerAs } from '@nestjs/config';

// 이메일 관련 환경 변수를 관리
// email 이라는 토큰으로 ConfigFactory를 등록
export default registerAs('email', () => ({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_AUTH_USER,
    pass: process.env.EMAIL_AUTH_PASSWORD,
  },
  baseUrl: process.env.EMAIL_BASE_URL,
}));
