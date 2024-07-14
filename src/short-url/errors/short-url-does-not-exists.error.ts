import { ApplicationError } from '../../common/app/error';

export class ShortURLDoesNotExistsError extends ApplicationError {
  constructor() {
    super();
    this.message = `SHORT URL does not exists`;
    this.name = ShortURLDoesNotExistsError.name;
  }
}
