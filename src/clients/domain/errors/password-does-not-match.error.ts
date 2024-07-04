import { DomainError } from '../../../common/domain';

export class PasswordDoesNotMatchError extends DomainError {
  constructor() {
    super();
    this.message = `password does not match`;
    this.name = PasswordDoesNotMatchError.name;
  }
}
