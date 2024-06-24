import { RedirectURLEntity } from '../../entities';

export type IGetLastIdRedirectUrlRepository = {
  getLastId: () => Promise<string>;
};

export type ISaveRedirectUrlRepository = {
  save: (entity: RedirectURLEntity) => Promise<void>;
};

export type IIncreaseLastIdRedirectUrlRepository = {
  increaseLastId: (entity: RedirectURLEntity) => Promise<void>;
};

export type IRedirectUrlRepository = IGetLastIdRedirectUrlRepository &
  ISaveRedirectUrlRepository &
  IIncreaseLastIdRedirectUrlRepository;
