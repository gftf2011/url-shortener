import { ISqlMasterDbTransaction } from '../../common/app/contracts/databases';
import { IShortUrlService } from '../contracts/services';

export class DistributedLockDecorator implements IShortUrlService {
  constructor(
    private readonly decoratee: IShortUrlService,
    private readonly masterTransaction: ISqlMasterDbTransaction,
  ) {}

  public async create(longUrl: string, clientId: string): Promise<string> {
    await this.masterTransaction.lockTable('SHORT_URL_COUNTER');
    const result = await this.decoratee.create(longUrl, clientId);
    await this.masterTransaction.unlockTable('SHORT_URL_COUNTER');
    return result;
  }

  public async get(shortUrlId: string): Promise<string> {
    const result = await this.decoratee.get(shortUrlId);
    return result;
  }

  public async delete(clientId: string, shortUrlId: string): Promise<void> {
    await this.decoratee.delete(clientId, shortUrlId);
  }
}
