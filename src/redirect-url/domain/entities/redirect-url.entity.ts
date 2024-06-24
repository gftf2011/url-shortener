import { AggregateRoot } from '../../../common/domain';
import { IDValueObject, ID_TYPE, URLValueObject } from '../value-objects';
import { UUIDValueObject as ClientIDValueObject } from '../../../clients/domain/value-objects';

type Props = {
  id: string;
  longUrl: string;
  clientId: string;
};

type Value = {
  id: IDValueObject;
  longUrl: URLValueObject;
  clientId: ClientIDValueObject;
};

export type RedirectUrlID = IDValueObject;

export class RedirectURLEntity extends AggregateRoot {
  protected override id: RedirectUrlID;

  private longUrl: URLValueObject;

  private clientId: ClientIDValueObject;

  private constructor(protected readonly props: Props) {
    super();
    this.id = IDValueObject.createAndValidateCustom(
      ID_TYPE.INCREMENTAL_HEX_10,
      props.id,
    );
    this.longUrl = URLValueObject.create(props.longUrl);
    this.clientId = ClientIDValueObject.tryToCreate(props.clientId);
  }

  static create({
    id,
    longUrl,
    clientId,
  }: {
    id: string;
    longUrl: string;
    clientId: string;
  }): RedirectURLEntity {
    return new RedirectURLEntity({ id, longUrl, clientId });
  }

  override getValue(): Value {
    return {
      id: this.id,
      longUrl: this.longUrl,
      clientId: this.clientId,
    };
  }
}
