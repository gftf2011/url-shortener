import { Module } from '@nestjs/common';
import { RedirectUrlController } from './redirect-url.controller';
import { RedirectUrlService } from './redirect-url.service';
import { FakeInMemoryRedirectUrlRepository } from './infra/repositories/redirect-url';
import { IRedirectUrlRepository } from './domain/repositories/redirect-url';
import { IClientRepository } from '../clients/domain/repositories/clients';
import { ClientsModule } from 'src/clients/clients.module';

@Module({
  imports: [ClientsModule],
  controllers: [RedirectUrlController],
  providers: [
    {
      provide: 'IRedirectUrlRepository',
      useFactory: () => FakeInMemoryRedirectUrlRepository.getInstance(),
    },
    {
      provide: 'IRedirectUrlService',
      useFactory: (
        redirecUrlRepo: IRedirectUrlRepository,
        clientsRepo: IClientRepository,
      ) => new RedirectUrlService(redirecUrlRepo, clientsRepo),
      inject: ['IRedirectUrlRepository', 'IClientRepository'],
    },
  ],
})
export class RedirectUrlModule {}
