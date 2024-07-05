import { DomainError } from '../../../common/domain';

export class InvalidIDError extends DomainError {
  constructor(value: string) {
    super();
    this.message = `id: '${value}' - is not valid`;
    this.name = InvalidIDError.name;
  }
}
