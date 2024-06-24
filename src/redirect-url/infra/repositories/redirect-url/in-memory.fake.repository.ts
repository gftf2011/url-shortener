import { RedirectURLEntity } from '../../../domain/entities';
import {
  IGetLastIdRedirectUrlRepository,
  IIncreaseLastIdRedirectUrlRepository,
  ISaveRedirectUrlRepository,
} from '../../../domain/repositories/redirect-url';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FakeInMemoryRedirectUrlRepository
  implements
    IGetLastIdRedirectUrlRepository,
    IIncreaseLastIdRedirectUrlRepository,
    ISaveRedirectUrlRepository
{
  private static instance: FakeInMemoryRedirectUrlRepository;

  private constructor(
    private redirectUrlsDataRecords: RedirectURLEntity[],
    private redirectUrlsDataCounter: {
      redirect_urls: {
        last_id: string;
      };
    },
  ) {}

  static getInstance(): FakeInMemoryRedirectUrlRepository {
    if (!this.instance) {
      this.instance = new FakeInMemoryRedirectUrlRepository([], {
        redirect_urls: { last_id: '0'.repeat(10) },
      });
    }
    return this.instance;
  }

  async save(entity: RedirectURLEntity): Promise<void> {
    this.redirectUrlsDataRecords.push(entity);
  }

  async increaseLastId(entity: RedirectURLEntity): Promise<void> {
    let value = entity.getValue().id.value;
    let decimalValue = parseInt(value, 16);
    decimalValue++;
    value = decimalValue.toString(16).padStart(10, '0');
    this.redirectUrlsDataCounter.redirect_urls.last_id = value;
  }

  async getLastId(): Promise<string> {
    return this.redirectUrlsDataCounter.redirect_urls.last_id;
  }
}
