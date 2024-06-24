import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedirectUrlModule } from './redirect-url/redirect-url.module';
import { ClientsModule } from './clients/clients.module';
import { AuthMiddleware } from './clients/middlewares';
import { RedirectUrlController } from './redirect-url/redirect-url.controller';
import { config } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    RedirectUrlModule,
    ClientsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(RedirectUrlController);
  }
}
