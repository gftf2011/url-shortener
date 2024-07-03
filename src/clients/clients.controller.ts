import { Controller, Inject, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { IClientService } from './contracts/services';
import { ClientDTO, CredentialsDTO } from './domain/dtos';

@Controller('clients')
export class ClientsController {
  constructor(
    @Inject('IClientService')
    private readonly clientService: IClientService,
  ) {}

  @Post('create-account')
  async createAccount(
    @Req()
    req: Request<any, any, ClientDTO>,
    @Res() res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const response = await this.clientService.createAccount(req.body);
      return res.status(201).json({ accessToken: response.accessToken });
    } catch (e: any) {
      const error: Error = e;
      return res.status(500).json({ error: error.message });
    }
  }

  @Post('login')
  async loginToAccount(
    @Req()
    req: Request<any, any, CredentialsDTO>,
    @Res() res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const response = await this.clientService.loginToAccount(req.body);
      return res.status(200).json({ accessToken: response.accessToken });
    } catch (e: any) {
      const error: Error = e;
      return res.status(500).json({ error: error.message });
    }
  }
}
