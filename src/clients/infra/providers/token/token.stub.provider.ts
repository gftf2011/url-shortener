import { ITokenProvider } from '../../../contracts/providers/token';

export class StubTokenProvider implements ITokenProvider {
  private signCounter: number = 0;
  private verifyCounter: number = 0;

  constructor(
    private readonly signResponses: Promise<string>[],
    private readonly verifyResponses: Promise<any>[],
  ) {}

  async sign(_payload: any): Promise<string> {
    const response = this.signResponses[this.signCounter];
    this.signCounter++;
    return response;
  }

  async verify(_token: string): Promise<any> {
    const response = this.verifyResponses[this.verifyCounter];
    this.verifyCounter++;
    return response;
  }
}
