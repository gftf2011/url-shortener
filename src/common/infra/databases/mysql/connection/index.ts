import mysql from 'mysql2/promise';
import { IDbConnection } from '../../../../app/contracts/databases';
import { Injectable } from '@nestjs/common';

type Config = {
  port: number;
  host: string;
  user: string;
  database: string;
  password: string;
  waitForConnections: boolean;
  connectionLimit: number;
  enableKeepAlive: boolean;
};

@Injectable()
export class MysqlDBConnection implements IDbConnection {
  private static pool: mysql.Pool;

  private static instance: MysqlDBConnection;

  private constructor() {}

  static getInstance(): MysqlDBConnection {
    if (!this.instance) {
      this.instance = new MysqlDBConnection();
    }
    return this.instance;
  }

  public async connect(config: Config): Promise<void> {
    if (!MysqlDBConnection.pool) {
      const pool = mysql.createPool({
        port: config.port,
        host: config.host,
        user: config.user,
        database: config.database,
        password: config.password,
        waitForConnections: true,
        connectionLimit: config.connectionLimit,
        enableKeepAlive: false,
      });

      let connected: boolean = false;

      const sleep = async (ms: number): Promise<void> => {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      };

      /**
       * Retry connection logic, postgres pool must
       * be tested before clients are created
       */
      while (!connected) {
        try {
          await sleep(1000);
          await pool.ping();
          connected = true;
        } catch (err) {
          connected = true;
        }
      }

      MysqlDBConnection.pool = pool;
    }
  }

  public async disconnect(): Promise<void> {
    await MysqlDBConnection.pool.end();
  }

  public async getConnection(): Promise<mysql.PoolConnection> {
    return MysqlDBConnection.pool.getConnection();
  }
}
