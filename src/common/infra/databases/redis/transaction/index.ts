import Redis from 'ioredis';
import {
  IDbConnection,
  IKeyValueDbTransaction,
} from '../../../../app/contracts/databases';
import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'generic-pool';

@Injectable()
export class RedisTransaction implements IKeyValueDbTransaction {
  private pool: Pool<Redis>;

  private client: Redis;

  constructor(
    @Inject('IDbConnection') private readonly connection: IDbConnection,
  ) {}

  public async createClient(): Promise<void> {
    this.pool = await this.connection.getConnection();
    this.client = await this.pool.acquire();
  }

  public async set(
    key: string,
    value: string,
    options?: { ttl_in_milliseconds: number },
  ): Promise<void> {
    await this.client.set(key, value, 'EX', options.ttl_in_milliseconds);
  }

  public async get(key: string): Promise<string> {
    return await this.client.get(key);
  }

  public async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  public async release(): Promise<void> {
    await this.pool.release(this.client);
  }

  public async close(): Promise<void> {
    await this.connection.disconnect();
  }
}
