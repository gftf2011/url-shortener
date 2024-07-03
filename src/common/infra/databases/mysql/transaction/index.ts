import mysql from 'mysql2/promise';
import {
  IDbConnection,
  ISqlDbTransaction,
} from '../../../../app/contracts/databases';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class MysqlTransaction implements ISqlDbTransaction {
  private client: mysql.PoolConnection;

  constructor(
    @Inject('IDbConnection') private readonly connection: IDbConnection,
  ) {}

  public async createClient(): Promise<void> {
    this.client = await this.connection.getConnection();
  }

  public async openTransaction(): Promise<void> {
    await this.client.beginTransaction();
  }

  public async query(queryText: string, values: any[]): Promise<any> {
    return this.client.query(queryText, values);
  }

  public async lockReadTable(table: string): Promise<void> {
    await this.client.query(`LOCK TABLES ${table} READ;`);
  }

  public async unlockTables(): Promise<void> {
    await this.client.query('UNLOCK TABLES;');
  }

  public async closeTransaction(): Promise<void> {
    this.client.release();
  }

  public async commit(): Promise<void> {
    await this.client.commit();
  }

  public async rollback(): Promise<void> {
    await this.client.rollback();
  }

  public async close(): Promise<void> {
    await this.connection.disconnect();
  }
}
