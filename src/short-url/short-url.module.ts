import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ShortUrlController } from './short-url.controller';
import { ShortUrlService } from './short-url.service';
import { IShortUrlRepository } from './domain/repositories/redirect-url';
import { IClientRepository } from '../clients/domain/repositories/clients';
import { ClientsModule } from 'src/clients/clients.module';
import { MysqlDBConnection } from '../common/infra/databases/mysql/connection';
import { MySqlShortUrlRepository } from './infra/repositories/short-url';
import {
  MysqlMasterTransaction,
  MysqlSlaveTransaction,
} from '../common/infra/databases/mysql/transaction';
import {
  ISingleDbConnection,
  IDbConnection,
  IKeyValueDbTransaction,
  ISqlMasterDbTransaction,
  ISqlSlaveDbTransaction,
} from '../common/app/contracts/databases';
import { UnitOfWorkDecorator } from './unit-of-work';
import { DistributedLockDecorator } from './distributed-lock';
import { RedisDBConnection } from '../common/infra/databases/redis/connection';
import { RedisTransaction } from '../common/infra/databases/redis/transaction';
import {
  CacheShortUrlOnFindByIdDecorator,
  DestroyCacheShortUrlOnDeleteDecorator,
} from './infra/repositories/short-url/decorators';

@Module({
  imports: [ClientsModule],
  controllers: [ShortUrlController],
  providers: [
    {
      provide: 'MysqlDBConnection',
      useFactory: () => MysqlDBConnection.getInstance(),
    },
    {
      provide: 'RedisConnection',
      useFactory: () => RedisDBConnection.getInstance(),
    },
    {
      provide: 'ISqlMasterDbTransaction',
      useFactory: (conn: IDbConnection) => new MysqlMasterTransaction(conn),
      inject: ['MysqlDBConnection'],
    },
    {
      provide: 'ISqlSlaveDbTransaction',
      useFactory: (conn: IDbConnection) => new MysqlSlaveTransaction(conn),
      inject: ['MysqlDBConnection'],
    },
    {
      provide: 'RedisTransaction',
      useFactory: (conn: ISingleDbConnection) => new RedisTransaction(conn),
      inject: ['RedisConnection'],
    },
    {
      provide: 'IShortUrlRepository',
      useFactory: (
        masterTransaction: ISqlMasterDbTransaction,
        slaveTransaction: ISqlSlaveDbTransaction,
        redisTransaction: IKeyValueDbTransaction,
      ) => {
        return new DestroyCacheShortUrlOnDeleteDecorator(
          new CacheShortUrlOnFindByIdDecorator(
            new MySqlShortUrlRepository(slaveTransaction, masterTransaction),
            redisTransaction,
          ),
          redisTransaction,
        );
      },
      inject: [
        'ISqlMasterDbTransaction',
        'ISqlSlaveDbTransaction',
        'RedisTransaction',
      ],
    },
    {
      provide: 'IShortUrlService',
      useFactory: (
        shortUrlRepo: IShortUrlRepository,
        clientsRepo: IClientRepository,
        masterTransaction: ISqlMasterDbTransaction,
        slaveTransaction: ISqlSlaveDbTransaction,
      ) =>
        new DistributedLockDecorator(
          new UnitOfWorkDecorator(
            new ShortUrlService(shortUrlRepo, clientsRepo),
            masterTransaction,
            slaveTransaction,
          ),
          masterTransaction,
        ),
      inject: [
        'IShortUrlRepository',
        'IClientRepository',
        'ISqlMasterDbTransaction',
        'ISqlSlaveDbTransaction',
      ],
    },
  ],
  exports: ['RedisTransaction'],
})
export class ShortUrlModule implements OnModuleInit, OnModuleDestroy {
  async onModuleInit(): Promise<void> {
    await MysqlDBConnection.getInstance().connect(
      {
        connectionLimit: parseInt(process.env.MYSQL_CONN_MAIN, 10),
        waitForConnections: true,
        enableKeepAlive: false,
        user: process.env.MYSQL_USER_MAIN,
        port: parseInt(process.env.MYSQL_PORT_MAIN, 10),
        database: process.env.MYSQL_DATABASE_MAIN,
        host: process.env.MYSQL_HOST_MAIN,
        password: process.env.MYSQL_PASSWORD_MAIN,
      },
      [
        {
          connectionLimit: parseInt(process.env.MYSQL_CONN_WORKER, 10),
          waitForConnections: true,
          enableKeepAlive: false,
          user: process.env.MYSQL_USER_WORKER,
          port: parseInt(process.env.MYSQL_PORT_WORKER, 10),
          database: process.env.MYSQL_DATABASE_WORKER,
          host: process.env.MYSQL_HOST_WORKER,
          password: process.env.MYSQL_PASSWORD_WORKER,
        },
      ],
    );

    await RedisDBConnection.getInstance().connect({
      db: parseInt(process.env.REDIS_DB, 10),
      port: parseInt(process.env.REDIS_PORT, 10),
      user: process.env.REDIS_CLIENT_USER,
      pass: process.env.REDIS_CLIENT_PASS,
      host: process.env.REDIS_HOST,
      maxClients: parseInt(process.env.REDIS_CONN, 10),
    });
  }

  async onModuleDestroy(): Promise<void> {
    await MysqlDBConnection.getInstance().disconnect();
    await RedisDBConnection.getInstance().disconnect();
  }
}
