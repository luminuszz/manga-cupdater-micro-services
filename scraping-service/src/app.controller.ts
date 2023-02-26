import { Controller } from '@nestjs/common';
import { EventPattern, Ctx, KafkaContext } from '@nestjs/microservices';
import { ScrapingService } from './scraping.service';
import { KafkaService } from './messaging/kafka.service';

type FindComicCapByUrlEvent = {
  props: {
    url: string;
    cap: number;
    name: string;
    id: string;
  };
};

@Controller()
export class AppController {
  constructor(
    private readonly scrappingService: ScrapingService,
    private readonly kafkaService: KafkaService,
  ) {}

  @EventPattern('tasks.jobs.findForNewChapters')
  async findComicCapByUrl(@Ctx() ctx: KafkaContext) {
    this.kafkaService
      .send('document.findAllUnread', {})
      .subscribe((data: FindComicCapByUrlEvent[]) => {
        data.forEach(({ props }) => {
          this.scrappingService.findComicCapByUrl({
            url: props.url,
            name: props.name,
            cap: props.cap,
            id: props.id,
          });
        });

        this.kafkaService.commitOffsets([
          {
            topic: ctx.getTopic(),
            partition: ctx.getPartition(),
            offset: ctx.getMessage().offset,
          },
        ]);
      });
  }
}
