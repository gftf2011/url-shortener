import { Controller, Inject, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { IClientService } from './contracts/services';
import { ClientDTO, CredentialsDTO } from './domain/dtos';
import { DomainError } from '../common/domain';
import { ApplicationError } from '../common/app/error';
import { AccountAlreadyExistsError, AccountDoesNotExistsError } from './errors';
import {
  InvalidEmailError,
  InvalidEmptyFullNameError,
  InvalidFewCharactersFullNameError,
  InvalidPasswordError,
  PasswordDoesNotMatchError,
} from './domain/errors';

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
      if (
        error.name === InvalidEmailError.name ||
        error.name === InvalidEmptyFullNameError.name ||
        error.name === InvalidFewCharactersFullNameError.name ||
        error.name === InvalidPasswordError.name
      ) {
        return res.status(400).json({ error: error.message });
      }
      if (error.name === AccountAlreadyExistsError.name) {
        return res.status(403).json({ error: error.message });
      }
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
      if (
        error.name === InvalidEmailError.name ||
        error.name === InvalidFewCharactersFullNameError.name ||
        error.name === InvalidPasswordError.name
      ) {
        return res.status(400).json({ error: error.message });
      }
      if (error.name === AccountDoesNotExistsError.name) {
        return res.status(401).json({ error: error.message });
      }
      if (error.name === PasswordDoesNotMatchError.name) {
        return res.status(403).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  }
}
