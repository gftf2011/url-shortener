import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ShortUrlModule } from './short-url/short-url.module';
import { ClientsModule } from './clients/clients.module';
import { AuthMiddleware } from './clients/middlewares';
import { GetCachedShortUrlMiddleware } from './short-url/middlewares';
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
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: ':id', method: RequestMethod.GET })
      .forRoutes(ShortUrlController);
    consumer
      .apply(GetCachedShortUrlMiddleware)
      .exclude(
        {
          path: '/',
          method: RequestMethod.POST,
        },
        {
          path: ':id',
          method: RequestMethod.DELETE,
        },
      )
      .forRoutes(ShortUrlController);
  }
}
