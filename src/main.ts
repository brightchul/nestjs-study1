import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// import * as dotenv from 'dotenv';
// import * as path from 'path';
// import { getEnvPath } from 'src/config/env';

// ConfigModule.forRoot({envFilePath}) 둘중 하나만 해도 된다
// dotenv.config({
//   path: path.resolve(getEnvPath()),
// });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 전역으로 설정할때 사용하는 방법
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
