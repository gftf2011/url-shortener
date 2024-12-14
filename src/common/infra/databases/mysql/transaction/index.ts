import mysql from 'mysql2/promise';
import {
  IDbConnection,
  ISqlMasterDbTransaction,
  ISqlSlaveDbTransaction,
} from '../../../../app/contracts/databases';
import { Injectable } from '@nestjs/common';

const sleep = async (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

@Injectable()
export class MysqlMasterTransaction implements ISqlMasterDbTransaction {
  private masterClient: mysql.PoolConnection;

  constructor(private readonly connection: IDbConnection) {}

  public async createClient(): Promise<void> {
    this.masterClient = await this.connection.getMasterConnection();
  }

  public async openTransaction(): Promise<void> {
    await this.masterClient.beginTransaction();
  }

  public async query(queryText: string, values: any[]): Promise<any> {
    return this.masterClient.query(queryText, values);
  }

  public async lockTable(table: string): Promise<void> {
    const conn: mysql.PoolConnection =
      await this.connection.getMasterConnection();
    let released: boolean = false;

    while (!released) {
      try {
        await conn.query(`INSERT INTO locks_schema.locks (name) VALUES (?);`, [
          table,
        ]);
        released = true;
      } catch (e) {
        await sleep(100);
      }
    }
    conn.release();
  }

  public async unlockTable(table: string): Promise<void> {
    const conn: mysql.PoolConnection =
      await this.connection.getMasterConnection();
    await conn.beginTransaction();
    await conn.query(`DELETE FROM locks_schema.locks WHERE name = ?;`, [table]);
    await conn.commit();
    conn.release();
  }

  public async closeTransaction(): Promise<void> {
    this.masterClient.release();
  }

  public async commit(): Promise<void> {
    await this.masterClient.commit();
  }

  public async rollback(): Promise<void> {
    await this.masterClient.rollback();
  }

  public async close(): Promise<void> {
    await this.connection.disconnect();
  }
}

@Injectable()
export class MysqlSlaveTransaction implements ISqlSlaveDbTransaction {
  private slaveClient: mysql.PoolConnection;

  constructor(private readonly connection: IDbConnection) {}

  public async createClient(): Promise<void> {
    this.slaveClient = await this.connection.getSlaveConnection();
  }

  public async query(queryText: string, values: any[]): Promise<any> {
    return this.slaveClient.query(queryText, values);
  }

  public async release(): Promise<void> {
    await this.slaveClient.release();
  }

  public async close(): Promise<void> {
    await this.connection.disconnect();
  }
}
