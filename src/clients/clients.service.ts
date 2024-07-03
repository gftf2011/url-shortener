import { Inject, Injectable } from '@nestjs/common';
import { ClientDTO, CredentialsDTO } from './domain/dtos';
import {
  IFindPlanByTierRepository,
  IFindClientByEmailRepository,
  ISaveClientRepository,
} from './domain/repositories/clients';
import { ClientEntity, PLAN_TYPES, PlanEntity } from './domain/entities';
import { ITokenProvider } from './contracts/providers/token';
import { IClientService } from './contracts/services';
import { ISqlDbTransaction } from '../common/app/contracts/databases';
import { EmailValueObject } from './domain/value-objects';

type IClientRepository = IFindPlanByTierRepository &
  IFindClientByEmailRepository &
  ISaveClientRepository;

@Injectable()
export class ClientsService implements IClientService {
  constructor(
    @Inject('IClientRepository')
    private readonly clientRepo: IClientRepository,
    @Inject('ITokenProvider')
    private readonly tokenProvider: ITokenProvider,
    @Inject('ISqlDbTransaction')
    private readonly transaction: ISqlDbTransaction,
  ) {}

  async createAccount(input: ClientDTO): Promise<{ accessToken: string }> {
    try {
      await this.transaction.createClient();
      await this.transaction.openTransaction();

      const freePlan: PlanEntity = await this.clientRepo.findPlanByTier(
        PLAN_TYPES.FREE,
      );

      const client = await ClientEntity.createNew({
        email: input.email,
        fullName: input.fullName,
        password: input.password,
        planId: freePlan.getValue().id.value,
        planTier: freePlan.getValue().tier,
        quotaDuration: freePlan.getValue().durationInMilliseconds,
      });

      const foundClient = await this.clientRepo.findByEmail(
        client.getValue().email,
      );

      if (foundClient) {
        throw new Error('account already exists');
      }

      await this.clientRepo.save(client);

      const accessToken = await this.tokenProvider.sign({
        clientId: client.getValue().id.value,
        planId: client.getValue().plan.getValue().id.value,
      });

      await this.transaction.commit();
      await this.transaction.closeTransaction();

      return {
        accessToken,
      };
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

      const foundClient = await this.clientRepo.findByEmail(
        EmailValueObject.create(input.email),
      );

      if (!foundClient) {
        throw new Error('account does not exists');
      }

      await foundClient.checkPasswordMatch(input.password);

      const accessToken = await this.tokenProvider.sign({
        clientId: foundClient.getValue().id.value,
        planId: foundClient.getValue().plan.getValue().id.value,
      });

      await this.transaction.commit();
      await this.transaction.closeTransaction();

      return {
        accessToken,
      };
    } catch (e) {
      await this.transaction.rollback();
      await this.transaction.closeTransaction();
      throw e;
    }
  }
}
