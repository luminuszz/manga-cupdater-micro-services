import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FindAllUnreadResponseDto } from './dto/find-all-unread-response.dto';
import { FindComicCapByUrlEvent } from './dto/find-comicby-url-event.dto';
import { BROKER_PROVIDER } from '../broker.provider';

@Injectable()
export class TaskService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject(BROKER_PROVIDER)
    private readonly client: ClientKafka,
  ) {}

  async onModuleInit(): Promise<void> {
    this.client.subscribeToResponseOf('document.findAllUnread');

    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  @Cron(CronExpression.EVERY_HOUR, {
    timeZone: 'America/Bahia',
  })
  async startComicsJobsTask() {
    console.log('running', 'startComicsJobsTask');

    this.client
      .send('document.findAllUnread', {})
      .subscribe((response: FindAllUnreadResponseDto[]) => {
        response.forEach(({ props }) => {
          const payload = {
            url: props.url,
            name: props.name,
            cap: props.cap,
            id: props.id,
          } satisfies FindComicCapByUrlEvent;

          this.client.emit('scraping.find-comic-cap-by-url', payload);
        });
      });
  }
}
