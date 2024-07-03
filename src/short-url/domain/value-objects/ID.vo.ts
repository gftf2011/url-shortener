import { ValueObject } from '../../../common/domain';

export enum ID_TYPE {
  INCREMENTAL_HEX = 'INCREMENTAL_HEX',
  INCREMENTAL_BASE36 = 'INCREMENTAL_BASE36',
}

export class IDValueObject extends ValueObject {
  private constructor(private readonly _value: string) {
    super();
  }

  get value(): string {
    return this._value;
  }

  static createAndValidateCustom(type: ID_TYPE, value: string): IDValueObject {
    switch (type) {
      case ID_TYPE.INCREMENTAL_HEX: {
        const regex = new RegExp(`^[0-9a-f]{10}$`);
        if (!regex.test(value)) {
          throw new Error(`id: ${value} - is invalid`);
        }

        return new IDValueObject(value.toLowerCase());
      }
      case ID_TYPE.INCREMENTAL_BASE36: {
        const regex = new RegExp(`^[0-9a-fA-Z]{10}$`);
        if (!regex.test(value)) {
          throw new Error(`id: ${value} - is invalid`);
        }

        return new IDValueObject(value);
      }
      default: {
        const regex = new RegExp(`^[0-9a-f]{10}$`);
        if (!regex.test(value)) {
          throw new Error(`id: ${value} - is invalid`);
        }

        return new IDValueObject(value.toLowerCase());
      }
    }
  }
}
