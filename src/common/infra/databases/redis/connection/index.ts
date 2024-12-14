import Redis from 'ioredis';
import { createPool, Pool } from 'generic-pool';
import { ISingleDbConnection } from '../../../../app/contracts/databases';
import { Injectable } from '@nestjs/common';

type Config = {
  db: number;
  port: number;
  user: string;
  pass: string;
  host: string;
  maxClients: number;
};

@Injectable()
export class RedisDBConnection implements ISingleDbConnection {
  private static pool: Pool<Redis>;

  private static instance: RedisDBConnection;

  private constructor() {}

  static getInstance(): RedisDBConnection {
    if (!this.instance) {
      this.instance = new RedisDBConnection();
    }
    return this.instance;
  }

  public async connect(config: Config): Promise<void> {
    if (!RedisDBConnection.pool) {
      const sleep = async (ms: number): Promise<void> => {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      };

      const pool = createPool(
        {
          create: async () => {
            const client = new Redis({
              db: config.db,
              host: config.host,
              port: config.port,
              username: config.user,
              password: config.pass,
            });

            return client;
          },
          destroy: async (client) => {
            await client.quit();
          },
        },
        { min: config.maxClients, max: config.maxClients, autostart: true },
      );

      await pool.ready();
      const redis = await pool.acquire();

      let connected: boolean = false;

      /**
       * Retry connection logic, postgres pool must
       * be tested before clients are created
       */
      while (!connected) {
        try {
          await sleep(1000);
          connected = (await redis.ping()) === 'PONG';
        } catch (err) {
          connected = false;
        }
      }

      await pool.release(redis);

      RedisDBConnection.pool = pool;
    }
  }

  public async disconnect(): Promise<void> {
    await RedisDBConnection.pool.drain();
    await RedisDBConnection.pool.clear();
  }

  public async getConnection(): Promise<Pool<Redis>> {
    return RedisDBConnection.pool;
  }
}
