import { IDValueObject } from '../../../domain/value-objects';
import { ShortUrlEntity } from '../../../domain/entities';
import { IShortUrlRepository } from '../../../domain/repositories/redirect-url';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FakeInMemoryShortUrlRepository implements IShortUrlRepository {
  private static instance: FakeInMemoryShortUrlRepository;

  private constructor(
    private shortUrlsDataRecords: ShortUrlEntity[],
    private shortUrlsDataCounter: {
      short_urls: {
        last_id: string;
      };
    },
  ) {}

  static getInstance(): FakeInMemoryShortUrlRepository {
    if (!this.instance) {
      this.instance = new FakeInMemoryShortUrlRepository([], {
        short_urls: { last_id: '0'.repeat(10) },
      });
    }
    return this.instance;
  }

  async save(entity: ShortUrlEntity): Promise<void> {
    this.shortUrlsDataRecords.push(entity);
  }

  async increaseLastId(entity: ShortUrlEntity): Promise<void> {
    let value = entity.getValue().id.value;
    let decimalValue = parseInt(value, 36);
    decimalValue++;
    value = decimalValue.toString(36).padStart(10, '0');
    this.shortUrlsDataCounter.short_urls.last_id = value;
  }

  async getLastId(): Promise<string> {
    return this.shortUrlsDataCounter.short_urls.last_id;
  }

  async findById(shortUrlId: IDValueObject): Promise<ShortUrlEntity> {
    const shortUrl = this.shortUrlsDataRecords.find(
      (entity) => entity.getValue().id.value === shortUrlId.value,
    );
    return shortUrl;
  }
}
