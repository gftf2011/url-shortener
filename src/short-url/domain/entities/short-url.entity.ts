import { AggregateRoot } from '../../../common/domain';
import { IDValueObject, ID_TYPE, URLValueObject } from '../value-objects';
import { UUIDValueObject as ClientIDValueObject } from '../../../clients/domain/value-objects';

type Props = {
  id: string;
  longUrl: string;
  clientId: string;
  createdAt: number;
  deletedAt?: number;
};

type Value = {
  id: IDValueObject;
  longUrl: URLValueObject;
  clientId: ClientIDValueObject;
  createdAt: Date;
  deletedAt?: Date;
  isDeleted: boolean;
};

export type ShortUrlID = IDValueObject;

export class ShortUrlEntity extends AggregateRoot {
  protected override id: ShortUrlID;

  private longUrl: URLValueObject;

  private clientId: ClientIDValueObject;

  private createdAt: Date;

  private deletedAt?: Date;

  private isDeleted: boolean = false;

  private constructor(protected readonly props: Props) {
    super();
    this.id = IDValueObject.createAndValidateCustom(
      ID_TYPE.INCREMENTAL_BASE36,
      props.id,
    );
    this.longUrl = URLValueObject.create(props.longUrl);
    this.clientId = ClientIDValueObject.tryToCreate(props.clientId);
    this.createdAt = new Date(props.createdAt);
    this.deletedAt = props.deletedAt ? new Date(props.deletedAt) : null;
    this.isDeleted = props.deletedAt ? true : false;
  }

  static createNew({
    id,
    longUrl,
    clientId,
  }: {
    id: string;
    longUrl: string;
    clientId: string;
  }): ShortUrlEntity {
    return new ShortUrlEntity({ id, longUrl, clientId, createdAt: Date.now() });
  }

  static create({
    id,
    longUrl,
    clientId,
    createdAt,
    deletedAt,
  }: {
    id: string;
    longUrl: string;
    clientId: string;
    createdAt: number;
    deletedAt?: number;
  }): ShortUrlEntity {
    return new ShortUrlEntity({ id, longUrl, clientId, createdAt, deletedAt });
  }

  public markAsDeleted(): void {
    this.isDeleted = true;
    this.deletedAt = new Date();
  }

  override getValue(): Value {
    return {
      id: this.id,
      longUrl: this.longUrl,
      clientId: this.clientId,
      createdAt: this.createdAt,
      deletedAt: this.deletedAt,
      isDeleted: this.isDeleted,
    };
  }
}
