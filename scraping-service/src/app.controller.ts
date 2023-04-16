import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';
import { KafkaProvider } from './messaging/kafka.provider';
import { FindSerieEpisodeJobData } from './queue/jobs/find-serie-episode';
import { QueueService } from './queue/queue.service';

type FindComicCapByUrlEvent = {
  props: {
    url: string;
    cap: number;
    name: string;
    id: string;
  };
};

type FindSerieEpisodeEvent = FindSerieEpisodeJobData;

@Controller()
export class AppController {
  constructor(
    private readonly queueService: QueueService,
    private readonly kafkaProvider: KafkaProvider,
  ) {}

  @EventPattern('tasks.jobs.findForNewChapters')
  async findComicCapByUrl(@Ctx() ctx: KafkaContext) {
    this.kafkaProvider
      .send('document.findAllUnread', {})
      .subscribe((data: FindComicCapByUrlEvent[]) => {
        data.forEach(({ props }) => {
          this.queueService.addComicCapByUrlQueue({
            url: props.url,
            name: props.name,
            cap: props.cap,
            id: props.id,
          });
        });

        this.kafkaProvider.commitOffsets([
          {
            topic: ctx.getTopic(),
            partition: ctx.getPartition(),
            offset: ctx.getMessage().offset,
          },
        ]);
      });
  }

  @EventPattern('tasks.jobs.findForNewClassRoomToday')
  async findClassRoomToday(@Ctx() ctx: KafkaContext) {
    await this.queueService.addFindTodayClassRomQueue();

    await this.kafkaProvider.commitOffsets([
      {
        topic: ctx.getTopic(),
        partition: ctx.getPartition(),
        offset: ctx.getMessage().offset,
      },
    ]);
  }

  @EventPattern('tasks.jobs.findForNewEpisodes')
  async findSerieEpisode(
    @Payload() data: FindSerieEpisodeEvent,
    @Ctx() ctx: KafkaContext,
  ) {
    await this.queueService.addFindSerieEpisodeQueue(data);

    await this.kafkaProvider.commitOffsets([
      {
        topic: ctx.getTopic(),
        partition: ctx.getPartition(),
        offset: ctx.getMessage().offset,
      },
    ]);
  }
}
