import { ValueObject } from '../../../common/domain';

/**
 * @desc Email regex
 * @author Esteban Küber
 * @link https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
 */
const VALID_EMAIL_REGEX =
  /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

export class EmailValueObject extends ValueObject {
  private constructor(private readonly _value: string) {
    super();
  }

  get value(): string {
    return this._value;
  }

  static create(value: string): EmailValueObject {
    EmailValueObject.validate(value);
    return new EmailValueObject(value.toLowerCase());
  }

  private static validate(value: string): void {
    if (!VALID_EMAIL_REGEX.test(value)) {
      throw new Error(`email: ${value} - is not valid`);
    }
  }
}
