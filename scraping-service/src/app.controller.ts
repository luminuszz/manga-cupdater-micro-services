import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ScrapingService } from './scraping.service';

type FindComicCapByUrlEvent = {
  url: string;
  cap: number;
  name: string;
  id: string;
};

@Controller()
export class AppController {
  constructor(private readonly scrappingService: ScrapingService) {}

  @EventPattern('tasks.jobs.findForNewChapters')
  async findComicCapByUrl(@Payload() data: FindComicCapByUrlEvent[]) {
    data.forEach((data) => {
      this.scrappingService.findComicCapByUrl({
        url: data.url,
        name: data.name,
        cap: data.cap,
        id: data.id,
      });
    });
  }
}
