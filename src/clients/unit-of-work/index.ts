import {
  ISqlMasterDbTransaction,
  ISqlSlaveDbTransaction,
} from '../../common/app/contracts/databases';
import { IClientService } from '../contracts/services';
import { ClientDTO, CredentialsDTO } from '../domain/dtos';

export class UnitOfWorkDecorator implements IClientService {
  constructor(
    private readonly decoratee: IClientService,
    private readonly masterTransaction: ISqlMasterDbTransaction,
    private readonly slaveTransaction: ISqlSlaveDbTransaction,
  ) {}

  public async createAccount(
    input: ClientDTO,
  ): Promise<{ accessToken: string }> {
    try {
      await this.slaveTransaction.createClient();
      await this.masterTransaction.createClient();
      await this.masterTransaction.openTransaction();

      const result = await this.decoratee.createAccount(input);

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

  public async loginToAccount(
    input: CredentialsDTO,
  ): Promise<{ accessToken: string }> {
    try {
      await this.slaveTransaction.createClient();
      const result = await this.decoratee.loginToAccount(input);
      await this.slaveTransaction.release();

      return result;
    } catch (e) {
      await this.slaveTransaction.release();
      throw e;
    }
  }
}
