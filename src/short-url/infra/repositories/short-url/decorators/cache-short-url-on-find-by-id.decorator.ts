import { ShortUrlEntity } from '../../../../domain/entities';
import { IShortUrlRepository } from '../../../../domain/repositories/redirect-url';
import { IKeyValueDbTransaction } from '../../../../../common/app/contracts/databases';
import { IDValueObject } from '../../../../domain/value-objects';

export class CacheShortUrlOnFindByIdDecorator implements IShortUrlRepository {
  constructor(
    private readonly repo: IShortUrlRepository,
    private readonly db: IKeyValueDbTransaction,
  ) {}

  async findById(shortUrlId: IDValueObject): Promise<ShortUrlEntity> {
    const entity = await this.repo.findById(shortUrlId);
    try {
      await this.db.createClient();
      await this.db.set(
        entity.getValue().id.value,
        entity.getValue().longUrl.value,
        { ttl_in_milliseconds: 3600000 },
      );
      await this.db.release();
    } catch (e) {
      await this.db.release();
    }
    return entity;
  }

  async save(entity: ShortUrlEntity): Promise<void> {
    await this.repo.save(entity);
  }

  async increaseLastId(entity: ShortUrlEntity): Promise<void> {
    return this.repo.increaseLastId(entity);
  }

  async getLastId(): Promise<string> {
    return this.repo.getLastId();
  }
}
