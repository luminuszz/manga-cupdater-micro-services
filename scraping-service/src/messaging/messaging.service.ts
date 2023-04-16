import { Injectable } from '@nestjs/common';
import { KafkaProvider } from './kafka.provider';

type NotifyCapNewCapEvent = {
  id: string;
  newChapter: string | number;
  url: string;
  name: string;
};
export type Status = 'read' | 'unread';
type UpdateCapStatusEvent = { id: string; status: Status; newChapter?: number };

type ClassRoomTodayEvent = {
  firstClass: string;
  secondClass: string;
  period: Date;
  matricula: string | number;
};

type UpdateEpisodeEvent = {
  id: string;
  episode: string;
  name: string;
  url: string;
};

@Injectable()
export class MessagingService {
  constructor(private readonly messageProvider: KafkaProvider) {}

  public async notifyNewChapter(data: NotifyCapNewCapEvent) {
    const payload: UpdateCapStatusEvent = {
      id: data.id,
      status: data.newChapter ? 'unread' : 'read',
    };

    this.messageProvider.emit('notification.chapter.updated', data);

    this.messageProvider.emit('scraping.newChapterFound', payload);
  }

  public async notifyNewEpisode(data: UpdateEpisodeEvent) {
    this.messageProvider.emit('notification.episode.updated', data);
  }

  public async notifyNewClassRoomToday(data: ClassRoomTodayEvent) {
    this.messageProvider.emit('notification.classroom-today', data);
  }
}
