import * as bcrypt from 'bcrypt';

import { ValueObject } from '../../../common/domain';
import { InvalidPasswordError } from '../errors';

const WHITE_SPACE_REGEX = /(\s)+/;

const NON_NUMBERS_REGEX = /(\D)/g;

const NON_LOWERCASE_LETTERS_REGEX = /([^a-z]*)/g;

const NON_UPPERCASE_LETTERS_REGEX = /([^A-Z]*)/g;

const NON_SPECIAL_CHARACTER_REGEX = /([^#$@]*)/g;

export class PasswordValueObject extends ValueObject {
  private constructor(private readonly _value: string) {
    super();
  }

  get value(): string {
    return this._value;
  }

  private static validate(password: string): void {
    if (
      !password ||
      WHITE_SPACE_REGEX.test(password) ||
      password.replace(NON_NUMBERS_REGEX, '').length < 8 ||
      password.replace(NON_LOWERCASE_LETTERS_REGEX, '').length < 1 ||
      password.replace(NON_UPPERCASE_LETTERS_REGEX, '').length < 1 ||
      password.replace(NON_SPECIAL_CHARACTER_REGEX, '').length < 1
    ) {
      throw new InvalidPasswordError();
    }
  }

  public static create(hashedPassword: string): PasswordValueObject {
    return new PasswordValueObject(hashedPassword);
  }

  public static async tryToCreateHexHashed(
    password: string,
  ): Promise<PasswordValueObject> {
    PasswordValueObject.validate(password);
    const newPassword = await bcrypt.hash(password, 12);
    return new PasswordValueObject(newPassword);
  }

  public async compare(plainTextPassword: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, this._value);
  }
}
