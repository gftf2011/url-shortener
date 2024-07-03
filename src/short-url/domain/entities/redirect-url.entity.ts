import { AggregateRoot } from '../../../common/domain';
import { IDValueObject, ID_TYPE, URLValueObject } from '../value-objects';
import { UUIDValueObject as ClientIDValueObject } from '../../../clients/domain/value-objects';

type Props = {
  id: string;
  longUrl: string;
  clientId: string;
  createdAt: number;
};

type Value = {
  id: IDValueObject;
  longUrl: URLValueObject;
  clientId: ClientIDValueObject;
  createdAt: Date;
};

export type ShortUrlID = IDValueObject;

export class ShortUrlEntity extends AggregateRoot {
  protected override id: ShortUrlID;

  private longUrl: URLValueObject;

  private clientId: ClientIDValueObject;

  private createdAt: Date;

  private constructor(protected readonly props: Props) {
    super();
    this.id = IDValueObject.createAndValidateCustom(
      ID_TYPE.INCREMENTAL_HEX_10,
      props.id,
    );
    this.longUrl = URLValueObject.create(props.longUrl);
    this.clientId = ClientIDValueObject.tryToCreate(props.clientId);
    this.createdAt = new Date(props.createdAt);
  }

  static create({
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

  override getValue(): Value {
    return {
      id: this.id,
      longUrl: this.longUrl,
      clientId: this.clientId,
      createdAt: this.createdAt,
    };
  }
}
