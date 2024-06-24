import { ValueObject } from '../../../common/domain';

export enum ID_TYPE {
  INCREMENTAL_HEX_10 = 'INCREMENTAL_HEX_10',
}

export class IDValueObject extends ValueObject {
  private constructor(private readonly _value: string) {
    super();
  }

  get value(): string {
    return this._value;
  }

  static createAndValidateCustom(type: ID_TYPE, value: string): IDValueObject {
    if (type === ID_TYPE.INCREMENTAL_HEX_10) {
      const regex = new RegExp(`^[0-9a-f]{10}$`);
      if (!regex.test(value)) {
        throw new Error(`id: ${value} - is invalid`);
      }

      return new IDValueObject(value.toLowerCase());
    }
  }
}
