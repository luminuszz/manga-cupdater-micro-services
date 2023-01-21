import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FindAllUnreadResponseDto } from './dto/find-all-unread-response.dto';
import { FindComicCapByUrlEvent } from './dto/find-comicby-url-event.dto';
import { KafkaService } from '../messaging/kafka.service';

@Injectable()
export class TaskService {
  constructor(private readonly kafka: KafkaService) {}

  private logger = new Logger(TaskService.name);

  @Cron(CronExpression.EVERY_HOUR, {
    timeZone: 'America/Bahia',
  })
  async startComicsJobsTask() {
    this.logger.log('Start comics jobs task');

    this.kafka
      .send('document.findAllUnread', {})
      .subscribe((response: FindAllUnreadResponseDto[]) => {
        const commics = response.map<FindComicCapByUrlEvent>(({ props }) => ({
          url: props.url,
          name: props.name,
          cap: props.cap,
          id: props.id,
        }));

        this.kafka.emit('tasks.jobs.findForNewChapters', commics);
      });
  }

  async startSyncDatabaseBatch() {
    this.logger.log('Start sync database batch');

    this.kafka.emit('tasks.jobs.syncDatabase', {});
  }
}
