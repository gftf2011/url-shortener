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
  ISqlDbTransaction,
} from '../common/app/contracts/databases';

@Module({
  imports: [ClientsModule],
  controllers: [ShortUrlController],
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
      provide: 'IShortUrlRepository',
      useFactory: (query: ISqlDbTransaction) => {
        return new MySqlShortUrlRepository(query);
      },
      inject: ['ISqlDbTransaction'],
    },
    {
      provide: 'IShortUrlService',
      useFactory: (
        shortUrlRepo: IShortUrlRepository,
        clientsRepo: IClientRepository,
        transaction: ISqlDbTransaction,
      ) => new ShortUrlService(shortUrlRepo, clientsRepo, transaction),
      inject: ['IShortUrlRepository', 'IClientRepository', 'ISqlDbTransaction'],
    },
  ],
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
  }

  async onModuleDestroy(): Promise<void> {
    await MysqlDBConnection.getInstance().disconnect();
  }
}
