import { DomainError } from '../../../common/domain';

export class ExceededLinksQuotaError extends DomainError {
  constructor() {
    super();
    this.message = `link creation quota exceeded`;
    this.name = ExceededLinksQuotaError.name;
  }
}
