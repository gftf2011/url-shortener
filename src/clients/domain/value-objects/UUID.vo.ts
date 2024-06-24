import { v4, validate } from 'uuid';
import { ValueObject } from '../../../common/domain';

export class UUIDValueObject extends ValueObject {
  private constructor(private readonly _value: string) {
    super();
  }

  get value(): string {
    return this._value;
  }

  private static isValid(value: string): void {
    if (!validate(value)) {
      throw new Error(`uuid: ${value} - is not valid`);
    }
  }

  public static tryToCreate(value: string): UUIDValueObject {
    UUIDValueObject.isValid(value);
    return new UUIDValueObject(value);
  }

  public static create(): UUIDValueObject {
    return new UUIDValueObject(v4());
  }
}
