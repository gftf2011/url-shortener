import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { MySqlClientsRepository } from './infra/repositories/clients';
import { PasetoTokenProvider } from './infra/providers/token';
import { IClientRepository } from './domain/repositories/clients';
import { ITokenProvider } from './contracts/providers/token';
import { MysqlDBConnection } from '../common/infra/databases/mysql/connection';
import { MysqlTransaction } from '../common/infra/databases/mysql/transaction';
import {
  IDbConnection,
  ISqlDbTransaction,
} from '../common/app/contracts/databases';
import { UnitOfWorkDecorator } from './unit-of-work';

@Module({
  controllers: [ClientsController],
  providers: [
    {
      provide: 'IDbConnection',
      useFactory: () => MysqlDBConnection.getInstance(),
    },
    {
      provide: 'ISqlDbTransaction',
      useFactory: (conn: IDbConnection) => new MysqlTransaction(conn),
      inject: ['IDbConnection'],
    },
    {
      provide: 'IClientRepository',
      useFactory: (query: ISqlDbTransaction) => {
        return new MySqlClientsRepository(query);
      },
      inject: ['ISqlDbTransaction'],
    },
    {
      provide: 'ITokenProvider',
      useFactory: () =>
        new PasetoTokenProvider(
          process.env.PRIVATE_KEY,
          process.env.PUBLIC_KEY,
        ),
    },
    {
      provide: 'IClientService',
      useFactory: (
        clientRepo: IClientRepository,
        tokenProvider: ITokenProvider,
        transaction: ISqlDbTransaction,
      ) =>
        new UnitOfWorkDecorator(
          new ClientsService(clientRepo, tokenProvider),
          transaction,
        ),
      inject: ['IClientRepository', 'ITokenProvider', 'ISqlDbTransaction'],
    },
  ],
  exports: ['IClientRepository', 'ITokenProvider'],
})
export class ClientsModule implements OnModuleInit, OnModuleDestroy {
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
  }

  async onModuleDestroy(): Promise<void> {
    await MysqlDBConnection.getInstance().disconnect();
  }
}
