import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ITokenProvider } from '../contracts/providers/token';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @Inject('ITokenProvider') private readonly tokenProvider: ITokenProvider,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.tokenProvider.verify(req.headers.authorization);
      req.headers.clientId = data.clientId;
      req.headers.planId = data.planId;
      next();
    } catch (e: any) {
      const error: Error = e;
      res.status(401).json({ error: error.message });
    }
  }
}
