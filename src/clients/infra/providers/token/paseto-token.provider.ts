import { V4 } from 'paseto';
import { ITokenProvider } from '../../../contracts/providers/token';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PasetoTokenProvider implements ITokenProvider {
  constructor(
    private readonly privateKey: string,
    private readonly publicKey: string,
  ) {}

  sign(payload: any): Promise<string> {
    return V4.sign(payload, this.privateKey, { expiresIn: '2 hours' });
  }

  verify(token: string): Promise<any> {
    return V4.verify(token, this.publicKey);
  }
}
