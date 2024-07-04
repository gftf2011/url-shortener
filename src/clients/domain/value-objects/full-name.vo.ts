import { ValueObject } from '../../../common/domain';
import {
  InvalidEmptyFullNameError,
  InvalidFewCharactersFullNameError,
} from '../errors';

const WHITE_SPACE_REGEX = /(\s)+/;

export class FullNameValueObject extends ValueObject {
  private constructor(private readonly _value: string) {
    super();
  }

  get value(): string {
    return this._value;
  }

  private static validate(value: string): void {
    const names: string[] = value
      .split(WHITE_SPACE_REGEX)
      .filter((value: string) => value.trim().length > 0);
    if (names.length === 0) {
      throw new InvalidEmptyFullNameError();
    }
    names.forEach((value: string) => {
      if (value.length < 2) {
        throw new InvalidFewCharactersFullNameError(names);
      }
    });
  }

  static create(value: string): FullNameValueObject {
    const newValue = value
      ? value
          .split(WHITE_SPACE_REGEX)
          .filter((value: string) => value.trim().length > 0)
          .join(' ')
          .toLowerCase()
      : '';
    FullNameValueObject.validate(newValue);
    return new FullNameValueObject(newValue);
  }
}
