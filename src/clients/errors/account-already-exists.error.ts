import { ApplicationError } from '../../common/app/error';

export class AccountAlreadyExistsError extends ApplicationError {
  constructor() {
    super();
    this.message = `account already exists`;
    this.name = AccountAlreadyExistsError.name;
  }
}
