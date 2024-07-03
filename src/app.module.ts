import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ShortUrlModule } from './short-url/short-url.module';
import { ClientsModule } from './clients/clients.module';
import { AuthMiddleware } from './clients/middlewares';
import { ShortUrlController } from './short-url/short-url.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ShortUrlModule,
    ClientsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(ShortUrlController);
  }
}
