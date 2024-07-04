import { ApplicationError } from '../../common/app/error';

export class AccountDoesNotExistsError extends ApplicationError {
  constructor() {
    super();
    this.message = `account does not exists`;
    this.name = AccountDoesNotExistsError.name;
  }
}
