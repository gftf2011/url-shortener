import { ShortUrlEntity } from './domain/entities';
import {
  IFindByIdShortUrlRepository,
  IGetLastIdShortUrlRepository,
  IIncreaseLastIdShortUrlRepository,
  ISaveShortUrlRepository,
  IDeleteShortUrlRepository,
} from './domain/repositories/redirect-url';
import { IShortUrlService } from './contracts/services';
import {
  IFindByIdClientRepository,
  IUpdateClientRepository,
} from '../clients/domain/repositories/clients';
import { IDValueObject, ID_TYPE } from './domain/value-objects';
import { ShortURLDoesNotExistsError } from './errors';
import { AccountDoesNotExistsError } from '../clients/errors';
import { UUIDValueObject } from '../clients/domain/value-objects';

type IShortUrlRepository = IGetLastIdShortUrlRepository &
  ISaveShortUrlRepository &
  IIncreaseLastIdShortUrlRepository &
  IFindByIdShortUrlRepository &
  IDeleteShortUrlRepository;

type IClientRepository = IFindByIdClientRepository & IUpdateClientRepository;

export class ShortUrlService implements IShortUrlService {
  constructor(
    private readonly ShortUrlRepo: IShortUrlRepository,
    private readonly clientRepo: IClientRepository,
  ) {}

  async create(longUrl: string, clientId: string): Promise<string> {
    const clientFound = await this.clientRepo.findById(
      UUIDValueObject.tryToCreate(clientId),
    );
    if (!clientFound) {
      throw new AccountDoesNotExistsError();
    }
    clientFound.confirmLinkCreation();

    const id = await this.ShortUrlRepo.getLastId();
    const ShortUrl = ShortUrlEntity.createNew({ id, longUrl, clientId });
    await this.ShortUrlRepo.increaseLastId(ShortUrl);

    await this.clientRepo.update(clientFound);
    await this.ShortUrlRepo.save(ShortUrl);

    return ShortUrl.getValue().id.value;
  }

  async get(shortUrlId: string): Promise<string> {
    const foundShortUrl = await this.ShortUrlRepo.findById(
      IDValueObject.createAndValidateCustom(
        ID_TYPE.INCREMENTAL_BASE36,
        shortUrlId,
      ),
    );

    if (!foundShortUrl || foundShortUrl.getValue().isDeleted) {
      throw new ShortURLDoesNotExistsError();
    }

    return foundShortUrl.getValue().longUrl.value;
  }

  async delete(clientId: string, shortUrlId: string): Promise<void> {
    const clientFound = await this.clientRepo.findById(
      UUIDValueObject.tryToCreate(clientId),
    );
    if (!clientFound) {
      throw new AccountDoesNotExistsError();
    }

    const foundShortUrl = await this.ShortUrlRepo.findById(
      IDValueObject.createAndValidateCustom(
        ID_TYPE.INCREMENTAL_BASE36,
        shortUrlId,
      ),
    );

    if (!foundShortUrl || foundShortUrl.getValue().isDeleted) {
      throw new ShortURLDoesNotExistsError();
    }

    clientFound.confirmLinkDeletion();
    foundShortUrl.markAsDeleted();

    await this.ShortUrlRepo.delete(foundShortUrl);
  }
}
