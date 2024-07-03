import { ValueObject } from '../../../common/domain';

export class URLValueObject extends ValueObject {
  private constructor(private readonly _value: string) {
    super();
  }

  get value(): string {
    return this._value;
  }

  static create(value: string): URLValueObject {
    value = decodeURIComponent(value);
    URLValueObject.validate(value);
    return new URLValueObject(value);
  }

  private static validate(value: string): void {
    const regex = /^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
    if (!regex.test(value)) {
      throw new Error(`url: ${value} - is not valid`);
    }

    if (value.length > 512) {
      throw new Error('url is too long');
    }
  }
}
