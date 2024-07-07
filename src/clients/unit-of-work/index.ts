import { ISqlDbTransaction } from '../../common/app/contracts/databases';
import { IClientService } from '../contracts/services';
import { ClientDTO, CredentialsDTO } from '../domain/dtos';

export class UnitOfWorkDecorator implements IClientService {
  constructor(
    private readonly decoratee: IClientService,
    private readonly transaction: ISqlDbTransaction,
  ) {}

  public async createAccount(
    input: ClientDTO,
  ): Promise<{ accessToken: string }> {
    try {
      await this.transaction.createClient();
      await this.transaction.openTransaction();

      const result = await this.decoratee.createAccount(input);

      await this.transaction.commit();
      await this.transaction.closeTransaction();

      return result;
    } catch (e) {
      await this.transaction.rollback();
      await this.transaction.closeTransaction();
      throw e;
    }
  }

  public async loginToAccount(
    input: CredentialsDTO,
  ): Promise<{ accessToken: string }> {
    try {
      await this.transaction.createClient();
      await this.transaction.openTransaction();

      const result = await this.decoratee.loginToAccount(input);

      await this.transaction.commit();
      await this.transaction.closeTransaction();

      return result;
    } catch (e) {
      await this.transaction.rollback();
      await this.transaction.closeTransaction();
      throw e;
    }
  }
}
