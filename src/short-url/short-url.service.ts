import { Inject, Injectable } from '@nestjs/common';
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
import { ISqlDbTransaction } from '../common/app/contracts/databases';
import { IDValueObject, ID_TYPE } from './domain/value-objects';
import { ShortURLDoesExistsError } from './errors';
import { AccountDoesNotExistsError } from '../clients/errors';

type IShortUrlRepository = IGetLastIdShortUrlRepository &
  ISaveShortUrlRepository &
  IIncreaseLastIdShortUrlRepository &
  IFindByIdShortUrlRepository;

type IClientRepository = IFindByIdClientRepository & IUpdateClientRepository;

@Injectable()
export class ShortUrlService implements IShortUrlService {
  constructor(
    @Inject('IShortUrlRepository')
    private readonly ShortUrlRepo: IShortUrlRepository,
    @Inject('IClientRepository')
    private readonly clientRepo: IClientRepository,
    @Inject('ISqlDbTransaction')
    private readonly transaction: ISqlDbTransaction,
  ) {}

  async create(longUrl: string, clientId: string): Promise<string> {
    try {
      await this.transaction.createClient();
      await this.transaction.openTransaction();
      await this.transaction.lockReadTable('short_urls_schema.counter');

      const id = await this.ShortUrlRepo.getLastId();

      await this.transaction.unlockTables();

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

      await this.transaction.commit();
      await this.transaction.closeTransaction();

      return ShortUrl.getValue().id.value;
    } catch (e) {
      await this.transaction.unlockTables();
      await this.transaction.rollback();
      await this.transaction.closeTransaction();
      throw e;
    }
  }

  async get(shortUrlId: string): Promise<string> {
    try {
      await this.transaction.createClient();
      await this.transaction.openTransaction();

      const foundShortUrl = await this.ShortUrlRepo.findById(
        IDValueObject.createAndValidateCustom(
          ID_TYPE.INCREMENTAL_BASE36,
          shortUrlId,
        ),
      );

      if (!foundShortUrl) {
        throw new ShortURLDoesExistsError();
      }

      await this.transaction.commit();
      await this.transaction.closeTransaction();

      return foundShortUrl.getValue().longUrl.value;
    } catch (e) {
      await this.transaction.rollback();
      await this.transaction.closeTransaction();
      throw e;
    }
  }
}
