import { Inject, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { CheckWithExistsNewChapterDto } from './jobs/find-comic-cap-by-url';
import { Queue } from 'bull';
import { ClientKafka } from '@nestjs/microservices';
import { BROKER_PROVIDER } from './providers/broker.provider';
import { isNumber } from 'lodash';

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

    @Inject(BROKER_PROVIDER)
    private readonly client: ClientKafka,
  ) {}

  public async findComicCapByUrl(data: CheckWithExistsNewChapterDto) {
    await this.findComicCapByUrlQueue.add(data);
  }

  public async notifyNewChapter(data: NotifyCapNewCapEvent) {
    const payload: UpdateCapStatusEvent = {
      id: data.id,
      status: data.newChapter ? 'unread' : 'read',
      newChapter: isNumber(data.newChapter)
        ? data.newChapter
        : Number(data.newChapter.replace(/\D/g, '')),
    };

    this.client.emit('document.updateStatus', payload);

    this.client.emit('notification.chapter.updated', data);
  }
}
