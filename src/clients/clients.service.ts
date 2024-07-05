import { ClientDTO, CredentialsDTO } from './domain/dtos';
import {
  IFindPlanByTierRepository,
  IFindClientByEmailRepository,
  ISaveClientRepository,
} from './domain/repositories/clients';
import { ClientEntity, PLAN_TYPES, PlanEntity } from './domain/entities';
import { ITokenProvider } from './contracts/providers/token';
import { IClientService } from './contracts/services';
import { EmailValueObject } from './domain/value-objects';
import { AccountAlreadyExistsError, AccountDoesNotExistsError } from './errors';

type IClientRepository = IFindPlanByTierRepository &
  IFindClientByEmailRepository &
  ISaveClientRepository;

export class ClientsService implements IClientService {
  constructor(
    private readonly clientRepo: IClientRepository,
    private readonly tokenProvider: ITokenProvider,
  ) {}

  async createAccount(input: ClientDTO): Promise<{ accessToken: string }> {
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
      throw new AccountAlreadyExistsError();
    }

    await this.clientRepo.save(client);

    const accessToken = await this.tokenProvider.sign({
      clientId: client.getValue().id.value,
      planId: client.getValue().plan.getValue().id.value,
    });

    return {
      accessToken,
    };
  }

  public async loginToAccount(
    input: CredentialsDTO,
  ): Promise<{ accessToken: string }> {
    const foundClient = await this.clientRepo.findByEmail(
      EmailValueObject.create(input.email),
    );

    if (!foundClient) {
      throw new AccountDoesNotExistsError();
    }

    await foundClient.checkPasswordMatch(input.password);

    const accessToken = await this.tokenProvider.sign({
      clientId: foundClient.getValue().id.value,
      planId: foundClient.getValue().plan.getValue().id.value,
    });

    return {
      accessToken,
    };
  }
}
