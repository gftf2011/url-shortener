import {
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { IShortUrlService } from './contracts/services';
import { AccountDoesNotExistsError } from '../clients/errors';
import { ExceededLinksQuotaError } from '../clients/domain/errors';
import {
  InvalidIDError,
  InvalidURLFormatError,
  InvalidURLTooLongError,
} from './domain/errors';
import { ShortURLDoesNotExistsError } from './errors';

@Controller()
export class ShortUrlController {
  constructor(
    @Inject('IShortUrlService')
    private readonly shortUrlService: IShortUrlService,
  ) {}

  @Post()
  async createShortUrl(
    @Req() req: Request<any, any, { longUrl: string }, any, any>,
    @Res() res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const response = await this.shortUrlService.create(
        req.body.longUrl,
        req.headers['clientId'] as string,
      );
      return res.status(201).json({ id: response });
    } catch (e: any) {
      const error: Error = e;
      if (
        error.name === InvalidURLFormatError.name ||
        error.name === InvalidURLTooLongError.name
      ) {
        return res.status(400).json({ error: error.message });
      }
      if (error.name === AccountDoesNotExistsError.name) {
        return res.status(401).json({ error: error.message });
      }
      if (error.name === ExceededLinksQuotaError.name) {
        return res.status(403).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  }

  @Get(':id')
  async redirect(
    @Req() req: Request<{ id: string }, any, any, any, any>,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const response = await this.shortUrlService.get(req.params.id);
      res.redirect(response);
    } catch (e: any) {
      const error: Error = e;
      if (error.name === InvalidIDError.name) {
        return res.status(400).json({ error: error.message });
      }
      if (error.name === ShortURLDoesNotExistsError.name) {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  }

  @Delete(':id')
  async deleteShortUrl(
    @Req() req: Request<{ id: string }, any, any, any, any>,
    @Res() res: Response,
  ): Promise<any> {
    try {
      await this.shortUrlService.delete(
        req.headers['clientId'] as string,
        req.params.id,
      );
      return res.status(204).end();
    } catch (e: any) {
      const error: Error = e;
      if (error.name === AccountDoesNotExistsError.name) {
        return res.status(401).json({ error: error.message });
      }
      if (error.name === ExceededLinksQuotaError.name) {
        return res.status(403).json({ error: error.message });
      }
      if (error.name === ShortURLDoesNotExistsError.name) {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  }
}
