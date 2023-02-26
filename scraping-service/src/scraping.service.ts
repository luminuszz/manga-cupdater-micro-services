import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { CheckWithExistsNewChapterDto } from './queue/jobs/find-comic-cap-by-url';
import { Queue } from 'bull';
import { KafkaService } from './messaging/kafka.service';

type NotifyCapNewCapEvent = {
  id: string;
  newChapter: string | number;
  url: string;
  name: string;
};
export type Status = 'read' | 'unread';
type UpdateCapStatusEvent = { id: string; status: Status; newChapter?: number };

@Injectable()
export class ScrapingService {
  constructor(
    @InjectQueue('find-comic-cap-by-url')
    private readonly findComicCapByUrlQueue: Queue<CheckWithExistsNewChapterDto>,

    private readonly client: KafkaService,
  ) {}

  public async findComicCapByUrl(data: CheckWithExistsNewChapterDto) {
    await this.findComicCapByUrlQueue.add(data, {
      removeOnComplete: true,
    });
  }

  public async notifyNewChapter(data: NotifyCapNewCapEvent) {
    const payload: UpdateCapStatusEvent = {
      id: data.id,
      status: data.newChapter ? 'unread' : 'read',
    };

    this.client.emit('notification.chapter.updated', data);

    this.client.emit('scraping.newChapterFound', payload);
  }
}
