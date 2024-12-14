import {
  ISqlMasterDbTransaction,
  ISqlSlaveDbTransaction,
} from '../../common/app/contracts/databases';
import { IShortUrlService } from '../contracts/services';

export class UnitOfWorkDecorator implements IShortUrlService {
  constructor(
    private readonly decoratee: IShortUrlService,
    private readonly masterTransaction: ISqlMasterDbTransaction,
    private readonly slaveTransaction: ISqlSlaveDbTransaction,
  ) {}

  public async create(longUrl: string, clientId: string): Promise<string> {
    try {
      await this.slaveTransaction.createClient();
      await this.masterTransaction.createClient();
      await this.masterTransaction.openTransaction();

      const result = await this.decoratee.create(longUrl, clientId);

      await this.slaveTransaction.release();
      await this.masterTransaction.commit();
      await this.masterTransaction.closeTransaction();

      return result;
    } catch (e) {
      await this.slaveTransaction.release();
      await this.masterTransaction.rollback();
      await this.masterTransaction.closeTransaction();
      throw e;
    }
  }

  public async get(shortUrlId: string): Promise<string> {
    try {
      await this.slaveTransaction.createClient();
      const result = await this.decoratee.get(shortUrlId);
      await this.slaveTransaction.release();

      return result;
    } catch (e) {
      await this.slaveTransaction.release();
      throw e;
    }
  }

  public async delete(clientId: string, shortUrlId: string): Promise<void> {
    try {
      await this.slaveTransaction.createClient();
      await this.masterTransaction.createClient();
      await this.masterTransaction.openTransaction();

      await this.decoratee.delete(clientId, shortUrlId);

      await this.slaveTransaction.release();
      await this.masterTransaction.commit();
      await this.masterTransaction.closeTransaction();
    } catch (e) {
      await this.slaveTransaction.release();
      await this.masterTransaction.rollback();
      await this.masterTransaction.closeTransaction();
      throw e;
    }
  }
}
