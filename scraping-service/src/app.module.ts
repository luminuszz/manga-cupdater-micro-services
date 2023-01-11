import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config';
import { FindComicCapByUrlJob } from './jobs/find-comic-cap-by-url';
import { AppController } from './app.controller';
import { ScrapingService } from './scraping.service';
import { BrokerProvider } from './providers/broker.provider';
import { BullModuleConfig } from './providers/queue.provider';

@Module({
  imports: [
    BullModule.forRootAsync(BullModuleConfig),
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.registerQueue({ name: 'find-comic-cap-by-url' }),
  ],
  providers: [FindComicCapByUrlJob, ScrapingService, BrokerProvider],
  controllers: [AppController],
})
export class AppModule {}
