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
  @EventPattern('scraping.find-comic-cap-by-url')
  async findComicCapByUrl(@Payload() data: FindComicCapByUrlEvent) {
    if (data && data.url && data.cap && data.name && data.id) {
      await this.scrappingService.findComicCapByUrl(data);
    }
  }
}
