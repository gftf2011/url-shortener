import { ITokenProvider } from '../../../contracts/providers/token';

export class DummyTokenProvider implements ITokenProvider {
  sign: (payload: any) => Promise<string>;
  verify: (token: string) => Promise<any>;
}
