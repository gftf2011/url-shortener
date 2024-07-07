import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { IKeyValueDbTransaction } from '../../common/app/contracts/databases';

@Injectable()
export class GetCachedShortUrlMiddleware implements NestMiddleware {
  constructor(
    @Inject('RedisTransaction') private readonly cache: IKeyValueDbTransaction,
  ) {}

  async use(
    req: Request<{ id: string }, any, any, any, any>,
    res: Response,
    next: NextFunction,
  ) {
    const id = req.params.id;
    try {
      await this.cache.createClient();
      const url = await this.cache.get(id);
      await this.cache.release();
      if (url) {
        res.redirect(url);
      } else {
        next();
      }
    } catch (e: any) {
      await this.cache.release();
      next();
    }
  }
}
