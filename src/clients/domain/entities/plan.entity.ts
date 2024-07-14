import { Entity } from '../../../common/domain';
import { UUIDValueObject } from '../value-objects';

export enum PLAN_TYPES {
  FREE = 'FREE',
}

type Props = {
  id: string;
  tier: PLAN_TYPES;
  linksCreationRechargeTime: number;
  linksDeletionRechargeTime: number;
};

type Value = {
  id: UUIDValueObject;
  tier: PLAN_TYPES;
  linksCreationQuota: number;
  linksCreationRechargeTime: number;
  linksDeletionQuota: number;
  linksDeletionRechargeTime: number;
};

export type PlanID = UUIDValueObject;

export class PlanEntity extends Entity {
  protected override id: PlanID;

  private tier: PLAN_TYPES;

  private linksDeletionQuota: number;

  private linksCreationQuota: number;

  private linksCreationRechargeTime: number;

  private linksDeletionRechargeTime: number;

  private constructor(protected readonly props: Props) {
    super();
    this.id = UUIDValueObject.tryToCreate(props.id);
    this.tier = props.tier;
    this.linksCreationQuota = PlanEntity.quotasByTier(props.tier)[0];
    this.linksDeletionQuota = PlanEntity.quotasByTier(props.tier)[1];
    this.linksCreationRechargeTime = props.linksCreationRechargeTime;
    this.linksDeletionRechargeTime = props.linksDeletionRechargeTime;
  }

  static create({
    id,
    tier,
    linksCreationRechargeTime,
    linksDeletionRechargeTime,
  }: {
    id: string;
    tier: PLAN_TYPES;
    linksCreationRechargeTime: number;
    linksDeletionRechargeTime: number;
  }): PlanEntity {
    return new PlanEntity({
      id,
      tier,
      linksCreationRechargeTime,
      linksDeletionRechargeTime,
    });
  }

  private static quotasByTier(tier: PLAN_TYPES): [number, number] {
    switch (tier) {
      case PLAN_TYPES.FREE:
        return [2, 2];
      default:
        return [2, 2];
    }
  }

  override getValue(): Value {
    return {
      id: this.id,
      tier: this.tier,
      linksCreationQuota: this.linksCreationQuota,
      linksCreationRechargeTime: this.linksCreationRechargeTime,
      linksDeletionQuota: this.linksDeletionQuota,
      linksDeletionRechargeTime: this.linksDeletionRechargeTime,
    };
  }
}
