import { AggregateRoot } from '../../../common/domain';
import {
  EmailValueObject,
  FullNameValueObject,
  PasswordValueObject,
  UUIDValueObject,
} from '../value-objects';
import { PlanEntity, PLAN_TYPES } from './plan.entity';

type CreateNewArgs = {
  email: string;
  password: string;
  fullName: string;
  planId: string;
  planTier: PLAN_TYPES;
  quotaDuration: number;
};

type CreateArgs = {
  id: string;
  email: string;
  password: string;
  fullName: string;
  planId: string;
  planTier: PLAN_TYPES;
  linksQuota: number;
  quotaRefreshIn: number;
  quotaDuration: number;
};

type Props = {
  id: UUIDValueObject;
  email: EmailValueObject;
  password: PasswordValueObject;
  fullName: FullNameValueObject;
  plan: PlanEntity;
  linksQuota: number;
  quotaRefreshIn: Date;
};

type Value = {
  id: UUIDValueObject;
  email: EmailValueObject;
  password: PasswordValueObject;
  fullName: FullNameValueObject;
  plan: PlanEntity;
  linksQuota: number;
  quotaRefreshIn: Date;
};

export type ClientID = UUIDValueObject;

export class ClientEntity extends AggregateRoot {
  protected override id: UUIDValueObject;

  protected email: EmailValueObject;

  protected password: PasswordValueObject;

  protected fullName: FullNameValueObject;

  protected plan: PlanEntity;

  protected linksQuota: number;

  protected quotaRefreshIn: Date;

  protected constructor(props: Props) {
    super();
    this.id = props.id;
    this.email = props.email;
    this.password = props.password;
    this.fullName = props.fullName;
    this.plan = props.plan;
    this.linksQuota = props.linksQuota;
    this.quotaRefreshIn = props.quotaRefreshIn;
  }

  public static async createNew(args: CreateNewArgs): Promise<ClientEntity> {
    const timestamp = new Date();

    const id = UUIDValueObject.create();
    const email = EmailValueObject.create(args.email);
    const password = await PasswordValueObject.tryToCreateHexHashed(
      args.password,
    );
    const fullName = FullNameValueObject.create(args.fullName);
    const plan = PlanEntity.create({
      id: args.planId,
      tier: args.planTier,
      durationInMilliseconds: args.quotaDuration,
    });
    const linksQuota = plan.getValue().quota;
    const quotaRefreshIn = timestamp;

    return new ClientEntity({
      id,
      email,
      password,
      fullName,
      plan,
      linksQuota,
      quotaRefreshIn,
    });
  }

  public static async create(args: CreateArgs): Promise<ClientEntity> {
    const id = UUIDValueObject.tryToCreate(args.id);
    const email = EmailValueObject.create(args.email);
    const password = PasswordValueObject.create(args.password);
    const fullName = FullNameValueObject.create(args.fullName);
    const plan = PlanEntity.create({
      id: args.planId,
      tier: args.planTier,
      durationInMilliseconds: args.quotaDuration,
    });
    const linksQuota = args.linksQuota;
    const quotaRefreshIn = new Date(args.quotaRefreshIn);

    return new ClientEntity({
      id,
      email,
      password,
      fullName,
      plan,
      linksQuota,
      quotaRefreshIn,
    });
  }

  public confirmLinkCreation(): void {
    const now = new Date();
    if (now.getTime() - this.quotaRefreshIn.getTime() >= 3600000) {
      this.linksQuota = this.plan.getValue().quota;
      this.quotaRefreshIn = now;
    }
    if (this.linksQuota === 0) {
      throw new Error('link creation quota exceeded');
    }
    this.linksQuota--;
  }

  override getValue(): Value {
    return {
      email: this.email,
      password: this.password,
      fullName: this.fullName,
      id: this.id,
      plan: this.plan,
      linksQuota: this.linksQuota,
      quotaRefreshIn: this.quotaRefreshIn,
    };
  }
}
