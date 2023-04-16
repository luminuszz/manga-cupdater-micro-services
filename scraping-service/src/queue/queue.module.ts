import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MessagingModule } from '../messaging/messaging.module';
import {
  FindComicCapByUrlJob,
  findComicCapByUrlJobToken,
} from './jobs/find-comic-cap-by-url';
import {
  FindSerieEpisodeJob,
  findSerieEpisodeJobToken,
} from './jobs/find-serie-episode';
import {
  FindTodayClassRoomJob,
  findTodayClassRomJobToken,
} from './jobs/find-today-classroom';
import { BullModuleConfig } from './queue.provider';
import { QueueService } from './queue.service';

@Module({
  imports: [
    MessagingModule,
    BullModule.forRootAsync(BullModuleConfig),
    BullModule.registerQueue(
      { name: findTodayClassRomJobToken },
      { name: findComicCapByUrlJobToken },
      { name: findSerieEpisodeJobToken },
    ),
  ],

  providers: [
    QueueService,
    FindComicCapByUrlJob,
    FindTodayClassRoomJob,
    FindSerieEpisodeJob,
  ],
  exports: [
    FindComicCapByUrlJob,
    FindTodayClassRoomJob,
    FindSerieEpisodeJob,
    QueueService,
  ],
})
export class QueueModule {}
