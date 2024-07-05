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
    try {
      await this.transaction.createClient();
      await this.transaction.openTransaction();

      const result = await this.decoratee.get(shortUrlId);

      await this.transaction.commit();
      await this.transaction.closeTransaction();

      return result;
    } catch (e) {
      await this.transaction.unlockTables();
      await this.transaction.rollback();
      await this.transaction.closeTransaction();
      throw e;
    }
  }
}
