import { Module } from '@nestjs/common';
import { BullModule, SharedBullAsyncConfiguration } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FindComicCapByUrlJob } from './jobs/find-comic-cap-by-url';
import { AppController } from './app.controller';
import { ScrapingService } from './scraping.service';
import { BrokerProvider } from './providers/broker.provider';

const bullModuleConfig: SharedBullAsyncConfiguration = {
  useFactory: (config: ConfigService<Env>) => ({
    redis: {
      port: config.get('REDIS_PORT' as keyof Env),
      host: config.get('REDIST_HOST' as keyof Env),
    },
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    BullModule.forRootAsync(bullModuleConfig),
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.registerQueue({ name: 'find-comic-cap-by-url' }),
  ],
  providers: [FindComicCapByUrlJob, ScrapingService, BrokerProvider],
  controllers: [AppController],
})
export class AppModule {}
