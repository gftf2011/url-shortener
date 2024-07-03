import mysql from 'mysql2/promise';
import { ShortUrlEntity } from '../../../domain/entities';
import { IShortUrlRepository } from '../../../domain/repositories/redirect-url';
import { Inject, Injectable } from '@nestjs/common';
import { ISqlDbQuery } from '../../../../common/app/contracts/databases';

@Injectable()
export class MySqlShortUrlRepository implements IShortUrlRepository {
  constructor(@Inject('ISqlDbTransaction') private readonly db: ISqlDbQuery) {}

  async save(entity: ShortUrlEntity): Promise<void> {
    const command =
      'INSERT INTO short_urls_schema.short_urls (id, client_id, long_url, created_at) VALUES (?, ?, ?, ?);';
    const values = [
      entity.getValue().id.value,
      entity.getValue().clientId.value,
      entity.getValue().longUrl.value,
      entity.getValue().createdAt.getTime(),
    ];

    await (this.db as mysql.PoolConnection).query(command, values);
  }

  async increaseLastId(entity: ShortUrlEntity): Promise<void> {
    let value = entity.getValue().id.value;
    let decimalValue = parseInt(value, 36);
    decimalValue++;
    value = decimalValue.toString(36).padStart(10, '0');

    const command =
      'UPDATE short_urls_schema.counter SET last_id = ? WHERE table_name = ?;';
    const values = [value, 'short_urls'];

    await (this.db as mysql.PoolConnection).query(command, values);
  }

  async getLastId(): Promise<string> {
    const command =
      'SELECT * FROM short_urls_schema.counter WHERE table_name = ?;';
    const values = ['short_urls'];

    const [rows] = await (this.db as mysql.PoolConnection).query(
      command,
      values,
    );

    return rows[0].last_id;
  }
}
