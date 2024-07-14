import { AggregateRoot } from '../../../common/domain';
import { ExceededLinksQuotaError, PasswordDoesNotMatchError } from '../errors';
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
  planCreateRechargeTime: number;
  planDeleteRechargeTime: number;
};

type CreateArgs = {
  id: string;
  email: string;
  password: string;
  fullName: string;
  planId: string;
  planTier: PLAN_TYPES;
  linksCreationQuota: number;
  linksDeletionQuota: number;
  planCreateRechargeTimeRefreshesIn: number;
  planDeleteRechargeTimeRefreshesIn: number;
  planCreateRechargeTime: number;
  planDeleteRechargeTime: number;
};

type Props = {
  id: UUIDValueObject;
  email: EmailValueObject;
  password: PasswordValueObject;
  fullName: FullNameValueObject;
  plan: PlanEntity;
  linksCreationQuota: number;
  linksDeletionQuota: number;
  planCreateRechargeTimeRefreshesIn: Date;
  planDeleteRechargeTimeRefreshesIn: Date;
};

type Value = {
  id: UUIDValueObject;
  email: EmailValueObject;
  password: PasswordValueObject;
  fullName: FullNameValueObject;
  plan: PlanEntity;
  linksCreationQuota: number;
  linksDeletionQuota: number;
  planCreateRechargeTimeRefreshesIn: Date;
  planDeleteRechargeTimeRefreshesIn: Date;
};

export type ClientID = UUIDValueObject;

export class ClientEntity extends AggregateRoot {
  protected override id: UUIDValueObject;

  protected email: EmailValueObject;

  protected password: PasswordValueObject;

  protected fullName: FullNameValueObject;

  protected plan: PlanEntity;

  protected linksCreationQuota: number;

  protected linksDeletionQuota: number;

  protected planCreateRechargeTimeRefreshesIn: Date;

  protected planDeleteRechargeTimeRefreshesIn: Date;

  protected constructor(props: Props) {
    super();
    this.id = props.id;
    this.email = props.email;
    this.password = props.password;
    this.fullName = props.fullName;
    this.plan = props.plan;
    this.linksCreationQuota = props.linksCreationQuota;
    this.linksDeletionQuota = props.linksDeletionQuota;
    this.planCreateRechargeTimeRefreshesIn =
      props.planCreateRechargeTimeRefreshesIn;
    this.planDeleteRechargeTimeRefreshesIn =
      props.planDeleteRechargeTimeRefreshesIn;
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
      linksCreationRechargeTime: args.planCreateRechargeTime,
      linksDeletionRechargeTime: args.planDeleteRechargeTime,
    });
    const linksCreationQuota = plan.getValue().linksCreationQuota;
    const planCreateRechargeTimeRefreshesIn = timestamp;

    const linksDeletionQuota = plan.getValue().linksDeletionQuota;
    const planDeleteRechargeTimeRefreshesIn = timestamp;

    return new ClientEntity({
      id,
      email,
      password,
      fullName,
      plan,
      linksCreationQuota,
      linksDeletionQuota,
      planDeleteRechargeTimeRefreshesIn,
      planCreateRechargeTimeRefreshesIn,
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
      linksCreationRechargeTime: args.planCreateRechargeTime,
      linksDeletionRechargeTime: args.planDeleteRechargeTime,
    });
    const linksCreationQuota = args.linksCreationQuota;
    const linksDeletionQuota = args.linksDeletionQuota;
    const planCreateRechargeTimeRefreshesIn = new Date(
      args.planCreateRechargeTimeRefreshesIn,
    );
    const planDeleteRechargeTimeRefreshesIn = new Date(
      args.planDeleteRechargeTimeRefreshesIn,
    );

    return new ClientEntity({
      id,
      email,
      password,
      fullName,
      plan,
      linksCreationQuota,
      linksDeletionQuota,
      planCreateRechargeTimeRefreshesIn,
      planDeleteRechargeTimeRefreshesIn,
    });
  }

  public confirmLinkCreation(): void {
    const now = new Date();
    if (
      now.getTime() - this.planCreateRechargeTimeRefreshesIn.getTime() >=
      this.plan.getValue().linksCreationRechargeTime
    ) {
      this.linksCreationQuota = this.plan.getValue().linksCreationQuota;
      this.planCreateRechargeTimeRefreshesIn = now;
    }
    if (this.linksCreationQuota === 0) {
      throw new ExceededLinksQuotaError();
    }
    this.linksCreationQuota--;
  }

  public confirmLinkDeletion(): void {
    const now = new Date();
    if (
      now.getTime() - this.planDeleteRechargeTimeRefreshesIn.getTime() >=
      this.plan.getValue().linksDeletionRechargeTime
    ) {
      this.linksDeletionQuota = this.plan.getValue().linksDeletionQuota;
      this.planDeleteRechargeTimeRefreshesIn = now;
    }
    if (this.linksDeletionQuota === 0) {
      throw new ExceededLinksQuotaError();
    }
    this.linksDeletionQuota--;
  }

  public async checkPasswordMatch(password: string): Promise<void> {
    if (!(await this.password.compare(password))) {
      throw new PasswordDoesNotMatchError();
    }
  }

  override getValue(): Value {
    return {
      email: this.email,
      password: this.password,
      fullName: this.fullName,
      id: this.id,
      plan: this.plan,
      linksCreationQuota: this.linksCreationQuota,
      linksDeletionQuota: this.linksDeletionQuota,
      planCreateRechargeTimeRefreshesIn: this.planCreateRechargeTimeRefreshesIn,
      planDeleteRechargeTimeRefreshesIn: this.planDeleteRechargeTimeRefreshesIn,
    };
  }
}
