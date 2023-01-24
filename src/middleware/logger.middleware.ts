import { NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    next();
  }
}

export class LoggerMiddleware2 implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    next();
  }
}

export function logger3(req: Request, res: Response, next: NextFunction) {
  console.log('Request3...');
  next();
}
