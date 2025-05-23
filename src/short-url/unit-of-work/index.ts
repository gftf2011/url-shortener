import { ISqlDbTransaction } from '../../common/app/contracts/databases';
import { IShortUrlService } from '../contracts/services';

export class UnitOfWorkDecorator implements IShortUrlService {
  constructor(
    private readonly decoratee: IShortUrlService,
    private readonly transaction: ISqlDbTransaction,
  ) {}

  public async create(longUrl: string, clientId: string): Promise<string> {
    try {
      await this.transaction.createClient();
      await this.transaction.openTransaction();

      const result = await this.decoratee.create(longUrl, clientId);

      await this.transaction.commit();
      await this.transaction.closeTransaction();

      return result;
    } catch (e) {
      await this.transaction.rollback();
      await this.transaction.closeTransaction();
      throw e;
    }
  }

  public async get(shortUrlId: string): Promise<string> {
    await this.transaction.createClient();
    const result = await this.decoratee.get(shortUrlId);
    await this.transaction.closeTransaction();
    return result;
  }

  public async delete(clientId: string, shortUrlId: string): Promise<void> {
    try {
      await this.transaction.createClient();
      await this.transaction.openTransaction();
      await this.decoratee.delete(clientId, shortUrlId);
      await this.transaction.commit();
      await this.transaction.closeTransaction();
    } catch (e) {
      await this.transaction.rollback();
      await this.transaction.closeTransaction();
      throw e;
    }
  }
}
