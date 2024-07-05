import { DomainError } from '../../../common/domain';

export class InvalidURLTooLongError extends DomainError {
  constructor(value: string, size: number) {
    super();
    this.message = `url: '${value}' - is longer than '${size}' allowed size`;
    this.name = InvalidURLTooLongError.name;
  }
}
