import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { FakeInMemoryClientsRepository } from './infra/repositories/clients';
import { PasetoTokenProvider } from './infra/providers/token';
import { IClientRepository } from './domain/repositories/clients';
import { ITokenProvider } from './contracts/providers/token';

@Module({
  controllers: [ClientsController],
  providers: [
    {
      provide: 'IClientRepository',
      useFactory: () => FakeInMemoryClientsRepository.getInstance(),
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
      ) => new ClientsService(clientRepo, tokenProvider),
      inject: ['IClientRepository', 'ITokenProvider'],
    },
  ],
  exports: ['IClientRepository', 'ITokenProvider'],
})
export class ClientsModule {}
