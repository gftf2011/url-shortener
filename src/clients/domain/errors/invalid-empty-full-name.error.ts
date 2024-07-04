import { DomainError } from '../../../common/domain';

export class InvalidEmptyFullNameError extends DomainError {
  constructor() {
    super();
    this.message = `name can not be empty`;
    this.name = InvalidEmptyFullNameError.name;
  }
}
