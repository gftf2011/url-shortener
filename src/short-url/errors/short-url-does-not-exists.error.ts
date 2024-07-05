import { ApplicationError } from '../../common/app/error';

export class ShortURLDoesExistsError extends ApplicationError {
  constructor() {
    super();
    this.message = `SHORT URL does not exists`;
    this.name = ShortURLDoesExistsError.name;
  }
}
