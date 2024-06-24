import {
  EmailValueObject,
  UUIDValueObject,
} from '../../../domain/value-objects';
import { ClientEntity, PLAN_TYPES, PlanEntity } from '../../../domain/entities';
import {
  IFindClientByEmailRepository,
  IFindPlanByTierRepository,
  ISaveClientRepository,
  IFindByIdClientRepository,
  IUpdateClientRepository,
} from '../../../domain/repositories/clients';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FakeInMemoryClientsRepository
  implements
    IFindClientByEmailRepository,
    IFindPlanByTierRepository,
    ISaveClientRepository,
    IFindByIdClientRepository,
    IUpdateClientRepository
{
  private static instance: FakeInMemoryClientsRepository;

  private constructor(
    private clientsDataRecords: ClientEntity[],
    private plansDataRecords: PlanEntity[],
  ) {}

  static getInstance(): FakeInMemoryClientsRepository {
    if (!this.instance) {
      this.instance = new FakeInMemoryClientsRepository(
        [],
        [
          PlanEntity.create({
            id: '5532b773-be2f-42e5-a4da-a0856bf0d62c',
            tier: PLAN_TYPES.FREE,
            durationInMilliseconds: 360000,
          }),
        ],
      );
    }
    return this.instance;
  }

  async save(entity: ClientEntity): Promise<void> {
    this.clientsDataRecords.push(entity);
  }

  async findByEmail(email: EmailValueObject): Promise<ClientEntity> {
    return this.clientsDataRecords.find(
      (client) => client.getValue().email.value === email.value,
    );
  }

  async findPlanByTier(tier: PLAN_TYPES): Promise<PlanEntity> {
    return this.plansDataRecords.find((plan) => plan.getValue().tier === tier);
  }

  async findById(id: UUIDValueObject): Promise<ClientEntity> {
    return this.clientsDataRecords.find(
      (client) => client.getValue().id.value === id.value,
    );
  }

  async update(client: ClientEntity): Promise<void> {
    this.clientsDataRecords.forEach(
      (c: ClientEntity, index: number, array: ClientEntity[]) => {
        if (c.getValue().id.value === client.getValue().id.value) {
          array[index] = client;
        }
      },
    );
  }
}
