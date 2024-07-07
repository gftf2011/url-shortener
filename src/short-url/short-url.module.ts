import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ShortUrlController } from './short-url.controller';
import { ShortUrlService } from './short-url.service';
import { IShortUrlRepository } from './domain/repositories/redirect-url';
import { IClientRepository } from '../clients/domain/repositories/clients';
import { ClientsModule } from 'src/clients/clients.module';
import { MysqlDBConnection } from '../common/infra/databases/mysql/connection';
import { MySqlShortUrlRepository } from './infra/repositories/short-url/mysql.repository';
import { MysqlTransaction } from '../common/infra/databases/mysql/transaction';
import {
  IDbConnection,
  IKeyValueDbTransaction,
  ISqlDbTransaction,
} from '../common/app/contracts/databases';
import { UnitOfWorkDecorator } from './unit-of-work';
import { RedisDBConnection } from '../common/infra/databases/redis/connection';
import { RedisTransaction } from '../common/infra/databases/redis/transaction';
import { CacheShortUrlOnFindByIdDecorator } from './infra/repositories/short-url/decorators';

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
      provide: 'MysqlTransaction',
      useFactory: (conn: IDbConnection) => new MysqlTransaction(conn),
      inject: ['MysqlDBConnection'],
    },
    {
      provide: 'RedisTransaction',
      useFactory: (conn: IDbConnection) => new RedisTransaction(conn),
      inject: ['RedisConnection'],
    },
    {
      provide: 'IShortUrlRepository',
      useFactory: (
        mysqlQuery: ISqlDbTransaction,
        redisTransaction: IKeyValueDbTransaction,
      ) => {
        return new CacheShortUrlOnFindByIdDecorator(
          new MySqlShortUrlRepository(mysqlQuery),
          redisTransaction,
        );
      },
      inject: ['MysqlTransaction', 'RedisTransaction'],
    },
    {
      provide: 'IShortUrlService',
      useFactory: (
        shortUrlRepo: IShortUrlRepository,
        clientsRepo: IClientRepository,
        transaction: ISqlDbTransaction,
      ) =>
        new UnitOfWorkDecorator(
          new ShortUrlService(shortUrlRepo, clientsRepo, transaction),
          transaction,
        ),
      inject: ['IShortUrlRepository', 'IClientRepository', 'MysqlTransaction'],
    },
  ],
  exports: ['RedisTransaction'],
})
export class ShortUrlModule implements OnModuleInit, OnModuleDestroy {
  async onModuleInit(): Promise<void> {
    await MysqlDBConnection.getInstance().connect({
      connectionLimit: parseInt(process.env.MYSQL_CONN, 10),
      waitForConnections: true,
      enableKeepAlive: false,
      user: process.env.MYSQL_USER,
      port: parseInt(process.env.MYSQL_PORT, 10),
      database: process.env.MYSQL_DATABASE,
      host: process.env.MYSQL_HOST,
      password: process.env.MYSQL_PASSWORD,
    });

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
