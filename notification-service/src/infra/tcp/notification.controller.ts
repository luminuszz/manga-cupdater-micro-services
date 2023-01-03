import { Controller } from '@nestjs/common';
import { SendNotification } from '@app/useCases/send-notification';
import { EventPattern, Payload } from '@nestjs/microservices';

export type ChapterUpdateEvent = {
  newChapter: string | number;
  chapter: string | number;
  url: string;
  name: string;
};

@Controller()
export class NotificationController {
  constructor(private readonly sendNotification: SendNotification) {}

  @EventPattern('notification.chapter.updated')
  async chapterUpdated(@Payload() data: ChapterUpdateEvent) {
    console.log('recieved chapter updated event ', data.name);

    await this.sendNotification.execute({
      content: JSON.stringify(data),
      recipient_id: Date.now().toString(),
    });
  }
}
