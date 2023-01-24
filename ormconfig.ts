import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { getEnvPath } from './src/config/env';

// tsconfig에서 "include": 추가 되어야 함
// ormconfig를 typeorm이 보는데 nestjs 실행때도 이 파일을 보게 됨
dotenv.config({
  path: path.resolve(getEnvPath()),
});

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  // migrationsRun : 서버가 구동될때 마이그레이션 파일을 기반으로 마이그레이션을
  // 수행할지 설정하는 옵션, CLI에서 직접입력
  migrationsRun: false,
  migrations: [__dirname + '/**/migrations/*{.js,.ts}'],
  migrationsTableName: 'migrations',
});
