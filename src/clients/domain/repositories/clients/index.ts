import { ClientEntity, ClientID, PLAN_TYPES, PlanEntity } from '../../entities';
import { EmailValueObject } from '../../value-objects';

export type IFindPlanByTierRepository = {
  findPlanByTier: (tier: PLAN_TYPES) => Promise<PlanEntity>;
};

export type IFindClientByEmailRepository = {
  findByEmail: (email: EmailValueObject) => Promise<ClientEntity>;
};

export type ISaveClientRepository = {
  save: (client: ClientEntity) => Promise<void>;
};

export type IFindByIdClientRepository = {
  findById: (id: ClientID) => Promise<ClientEntity>;
};

export type IUpdateClientRepository = {
  update: (client: ClientEntity) => Promise<void>;
};

export type IClientRepository = IFindPlanByTierRepository &
  IFindClientByEmailRepository &
  ISaveClientRepository &
  IFindByIdClientRepository &
  IUpdateClientRepository;
