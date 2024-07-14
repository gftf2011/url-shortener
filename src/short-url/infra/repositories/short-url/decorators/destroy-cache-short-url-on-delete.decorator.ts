import { ShortUrlEntity } from '../../../../domain/entities';
import { IShortUrlRepository } from '../../../../domain/repositories/redirect-url';
import { IKeyValueDbTransaction } from '../../../../../common/app/contracts/databases';
import { IDValueObject } from '../../../../domain/value-objects';

export class DestroyCacheShortUrlOnDeleteDecorator
  implements IShortUrlRepository
{
  constructor(
    private readonly repo: IShortUrlRepository,
    private readonly db: IKeyValueDbTransaction,
  ) {}

  async findById(shortUrlId: IDValueObject): Promise<ShortUrlEntity> {
    return this.repo.findById(shortUrlId);
  }

  async delete(entity: ShortUrlEntity): Promise<void> {
    await this.repo.delete(entity);
    /**
     * Failover approach avoid crashing the application allowing the cache handling
     */
    try {
      await this.db.createClient();
      await this.db.del(entity.getValue().id.value);
      await this.db.release();
    } catch (e) {
      await this.db.release();
    }
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
