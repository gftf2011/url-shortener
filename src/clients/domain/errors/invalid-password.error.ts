import { DomainError } from '../../../common/domain';

export class InvalidPasswordError extends DomainError {
  constructor() {
    super();
    this.message = `password is invalid`;
    this.name = InvalidPasswordError.name;
  }
}
