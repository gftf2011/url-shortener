import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { MySqlClientsRepository } from './infra/repositories/clients';
import { PasetoTokenProvider } from './infra/providers/token';
import { IClientRepository } from './domain/repositories/clients';
import { ITokenProvider } from './contracts/providers/token';
import { MysqlDBConnection } from '../common/infra/databases/mysql/connection';
import {
  MysqlMasterTransaction,
  MysqlSlaveTransaction,
} from '../common/infra/databases/mysql/transaction';
import {
  IDbConnection,
  ISqlMasterDbTransaction,
  ISqlSlaveDbTransaction,
} from '../common/app/contracts/databases';
import { UnitOfWorkDecorator } from './unit-of-work';

@Module({
  controllers: [ClientsController],
  providers: [
    {
      provide: 'MysqlDBConnection',
      useFactory: () => MysqlDBConnection.getInstance(),
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
      provide: 'IClientRepository',
      useFactory: (
        readQuery: ISqlSlaveDbTransaction,
        writeQuery: ISqlMasterDbTransaction,
      ) => {
        return new MySqlClientsRepository(readQuery, writeQuery);
      },
      inject: ['ISqlSlaveDbTransaction', 'ISqlMasterDbTransaction'],
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
        masterTransaction: ISqlMasterDbTransaction,
        slaveTransaction: ISqlSlaveDbTransaction,
      ) =>
        new UnitOfWorkDecorator(
          new ClientsService(clientRepo, tokenProvider),
          masterTransaction,
          slaveTransaction,
        ),
      inject: [
        'IClientRepository',
        'ITokenProvider',
        'ISqlMasterDbTransaction',
        'ISqlSlaveDbTransaction',
      ],
    },
  ],
  exports: ['IClientRepository', 'ITokenProvider'],
})
export class ClientsModule implements OnModuleInit, OnModuleDestroy {
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
  }

  async onModuleDestroy(): Promise<void> {
    await MysqlDBConnection.getInstance().disconnect();
  }
}
