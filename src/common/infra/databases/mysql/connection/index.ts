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
  private static poolCluster: mysql.PoolCluster;

  private static instance: MysqlDBConnection;

  private constructor() {}

  static getInstance(): MysqlDBConnection {
    if (!this.instance) {
      this.instance = new MysqlDBConnection();
    }
    return this.instance;
  }

  public async connect(
    masterConfig: Config,
    slaveConfigs: Config[],
  ): Promise<void> {
    if (!MysqlDBConnection.poolCluster) {
      const poolCluster = mysql.createPoolCluster();

      poolCluster.add('MASTER', {
        port: masterConfig.port,
        host: masterConfig.host,
        user: masterConfig.user,
        database: masterConfig.database,
        password: masterConfig.password,
        waitForConnections: true,
        connectionLimit: masterConfig.connectionLimit,
        enableKeepAlive: false,
      });

      slaveConfigs.forEach((config: Config, index: number) => {
        poolCluster.add(`REPLICA${index}`, {
          port: config.port,
          host: config.host,
          user: config.user,
          database: config.database,
          password: config.password,
          waitForConnections: true,
          connectionLimit: config.connectionLimit,
          enableKeepAlive: false,
        });
      });

      let connection: mysql.PoolConnection = null;

      const sleep = async (ms: number): Promise<void> => {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      };

      /**
       * Retry connection logic, postgres pool must
       * be tested before clients are created
       */
      while (!connection) {
        try {
          await sleep(1000);
          connection = await poolCluster.getConnection('MASTER');
        } catch (err) {
          connection = null;
        }
      }

      connection.release();

      MysqlDBConnection.poolCluster = poolCluster;
    }
  }

  public async disconnect(): Promise<void> {
    await MysqlDBConnection.poolCluster.end();
  }

  public async getMasterConnection(): Promise<mysql.PoolConnection> {
    return MysqlDBConnection.poolCluster.getConnection('MASTER');
  }

  public async getSlaveConnection(): Promise<mysql.PoolConnection> {
    return MysqlDBConnection.poolCluster.getConnection('REPLICA*');
  }
}
