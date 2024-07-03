import { Controller, Inject, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { IShortUrlService } from './contracts/services';

@Controller()
export class ShortUrlController {
  constructor(
    @Inject('IShortUrlService')
    private readonly ShortUrlService: IShortUrlService,
  ) {}

  @Post()
  async create(
    @Req() req: Request<any, any, { longUrl: string }, any, any>,
    @Res() res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const response = await this.ShortUrlService.create(
        req.body.longUrl,
        req.headers['clientId'] as string,
      );
      return res.status(201).json({ id: response });
    } catch (e: any) {
      const error: Error = e;
      return res.status(500).json({ error: error.message });
    }
  }
}
