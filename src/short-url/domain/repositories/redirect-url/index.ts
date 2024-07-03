import { ShortUrlEntity } from '../../entities';

export type IGetLastIdShortUrlRepository = {
  getLastId: () => Promise<string>;
};

export type ISaveShortUrlRepository = {
  save: (entity: ShortUrlEntity) => Promise<void>;
};

export type IIncreaseLastIdShortUrlRepository = {
  increaseLastId: (entity: ShortUrlEntity) => Promise<void>;
};

export type IShortUrlRepository = IGetLastIdShortUrlRepository &
  ISaveShortUrlRepository &
  IIncreaseLastIdShortUrlRepository;
