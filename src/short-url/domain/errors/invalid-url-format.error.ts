import { DomainError } from '../../../common/domain';

export class InvalidURLFormatError extends DomainError {
  constructor(value: string) {
    super();
    this.message = `url: '${value}' - is not valid`;
    this.name = InvalidURLFormatError.name;
  }
}
