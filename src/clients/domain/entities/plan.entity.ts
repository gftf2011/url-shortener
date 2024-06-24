import { Entity } from '../../../common/domain';
import { UUIDValueObject } from '../value-objects';

export enum PLAN_TYPES {
  FREE = 'FREE',
}

type Props = {
  id: string;
  tier: PLAN_TYPES;
  durationInMilliseconds: number;
};

type Value = {
  id: UUIDValueObject;
  tier: PLAN_TYPES;
  quota: number;
  durationInMilliseconds: number;
};

export type PlanID = UUIDValueObject;

export class PlanEntity extends Entity {
  protected override id: PlanID;

  private tier: PLAN_TYPES;

  private quota: number;

  private durationInMilliseconds: number;

  private constructor(protected readonly props: Props) {
    super();
    this.id = UUIDValueObject.tryToCreate(props.id);
    this.tier = props.tier;
    this.quota = PlanEntity.quotasByTier(props.tier);
    this.durationInMilliseconds = props.durationInMilliseconds;
  }

  static create({
    id,
    tier,
    durationInMilliseconds,
  }: {
    id: string;
    tier: PLAN_TYPES;
    durationInMilliseconds: number;
  }): PlanEntity {
    return new PlanEntity({
      id,
      tier,
      durationInMilliseconds,
    });
  }

  private static quotasByTier(tier: PLAN_TYPES): number {
    switch (tier) {
      case PLAN_TYPES.FREE:
        return 2;
      default:
        return 2;
    }
  }

  override getValue(): Value {
    return {
      id: this.id,
      tier: this.tier,
      quota: this.quota,
      durationInMilliseconds: this.durationInMilliseconds,
    };
  }
}
