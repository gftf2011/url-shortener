import { DomainError } from '../../../common/domain';

export class InvalidFewCharactersFullNameError extends DomainError {
  constructor(names: string[]) {
    super();
    this.message = `name: '${names.join(' ')}' - is invalid`;
    this.name = InvalidFewCharactersFullNameError.name;
  }
}
