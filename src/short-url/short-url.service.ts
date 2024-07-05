import { ShortUrlEntity } from './domain/entities';
import {
  IFindByIdShortUrlRepository,
  IGetLastIdShortUrlRepository,
  IIncreaseLastIdShortUrlRepository,
  ISaveShortUrlRepository,
} from './domain/repositories/redirect-url';
import { IShortUrlService } from './contracts/services';
import {
  IFindByIdClientRepository,
  IUpdateClientRepository,
} from '../clients/domain/repositories/clients';
import { ISqlDbLocker } from '../common/app/contracts/databases';
import { IDValueObject, ID_TYPE } from './domain/value-objects';
import { ShortURLDoesExistsError } from './errors';
import { AccountDoesNotExistsError } from '../clients/errors';

type IShortUrlRepository = IGetLastIdShortUrlRepository &
  ISaveShortUrlRepository &
  IIncreaseLastIdShortUrlRepository &
  IFindByIdShortUrlRepository;

type IClientRepository = IFindByIdClientRepository & IUpdateClientRepository;

export class ShortUrlService implements IShortUrlService {
  constructor(
    private readonly ShortUrlRepo: IShortUrlRepository,
    private readonly clientRepo: IClientRepository,
    private readonly locker: ISqlDbLocker,
  ) {}

  async create(longUrl: string, clientId: string): Promise<string> {
    await this.locker.lockReadTable('short_urls_schema.counter');
    const id = await this.ShortUrlRepo.getLastId();
    await this.locker.unlockTables();

    const ShortUrl = ShortUrlEntity.createNew({ id, longUrl, clientId });
    const clientFound = await this.clientRepo.findById(
      ShortUrl.getValue().clientId,
    );
    if (!clientFound) {
      throw new AccountDoesNotExistsError();
    }
    clientFound.confirmLinkCreation();
    await this.clientRepo.update(clientFound);
    await this.ShortUrlRepo.save(ShortUrl);
    await this.ShortUrlRepo.increaseLastId(ShortUrl);

    return ShortUrl.getValue().id.value;
  }

  async get(shortUrlId: string): Promise<string> {
    const foundShortUrl = await this.ShortUrlRepo.findById(
      IDValueObject.createAndValidateCustom(
        ID_TYPE.INCREMENTAL_BASE36,
        shortUrlId,
      ),
    );

    if (!foundShortUrl) {
      throw new ShortURLDoesExistsError();
    }

    return foundShortUrl.getValue().longUrl.value;
  }
}
