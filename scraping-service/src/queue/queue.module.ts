import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { BullModuleConfig } from './queue.provider';
import { ConfigModule } from '@nestjs/config';
import {
  FindComicCapByUrlJob,
  findComicCapByUrlJobToken,
} from './jobs/find-comic-cap-by-url';
import { ScrapingService } from '../scraping.service';
import { MessagingModule } from '../messaging/messaging.module';

@Module({
  imports: [
    BullModule.forRootAsync(BullModuleConfig),
    BullModule.registerQueue({ name: findComicCapByUrlJobToken }),
    MessagingModule,
  ],

  providers: [FindComicCapByUrlJob, ScrapingService],
  exports: [FindComicCapByUrlJob, ScrapingService],
})
export class QueueModule {}
