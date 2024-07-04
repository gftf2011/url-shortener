import { DomainError } from '../../../common/domain';

export class InvalidUUIDError extends DomainError {
  constructor(value: string) {
    super();
    this.message = `uuid: ${value} - is not valid`;
    this.name = InvalidUUIDError.name;
  }
}
