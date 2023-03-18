import { SendNotification } from '@app/useCases/send-notification';
import { Controller, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventPattern, Payload } from '@nestjs/microservices';
import { format } from 'date-fns';

export type ChapterUpdateEvent = {
  newChapter: string | number;
  chapter: string | number;
  url: string;
  name: string;
};

export interface UpdateOrderStatusTrakingEvent {
  traking_code: string;
  message: string;
  date: string;
  recipient_id: string;
  name?: string;
}

type ClassRoomTodayEvent = {
  classroom: string[];
  period: string;
  matricula: number | string;
};

@Controller()
export class NotificationController {
  constructor(
    private readonly sendNotification: SendNotification,
    private readonly config: ConfigService,
  ) {}

  private logger = new Logger(NotificationController.name);

  @EventPattern('notification.chapter.updated')
  async chapterUpdated(@Payload() data: ChapterUpdateEvent) {
    this.logger.log(`recieved chapter updated event  -> ${data.name}`);

    const content = `
   ${data.name} - Capítulo Novo disponível - ${data.newChapter} !
    Novo Capítulo: ${data.newChapter}
    link -> ${data.url}
    `;

    await this.sendNotification.execute({
      content: content,
      recipient_id: this.config.get('TELEGRAM_CHAT_ID'),
    });
  }

  @EventPattern('notification.update-order-status')
  async updateOrderStatusTraking(
    @Payload() data: UpdateOrderStatusTrakingEvent,
  ) {
    this.logger.log(`recieved order updated event  -> ${data.traking_code}`);

    const formattedDate = format(new Date(data.date), 'dd/MM/yyyy HH:mm:ss');

    const content = ` 
     📦   O status do seu pacote foi alterado: ${
       data.name ? `**${data.name}**` : ''
     }
   
     ✍️   Pacote: **${data.traking_code}** 
     🚚   Status: **${data.message}**
     ⏳   Data: **${formattedDate}**
     
    `;

    await this.sendNotification.execute({
      content,
      recipient_id: '5887244798',
    });
  }

  @EventPattern('notification.classroom-today')
  async handleClassRoomTodayMessage(@Payload() data: ClassRoomTodayEvent) {
    this.logger.log(`recieved order updated event  -> ${data.period}`);

    const content = `
    ** ⏳⏳⏳ AULAS DE HOJE  ⏳⏳⏳ **
    
      Primeira aula: ${data.classroom[0]}
      
      Segunda aula: ${data.classroom[1]}
      
      Periodo: **${data.period}**
      
      Matricula: **${data.matricula}**
    `;

    await this.sendNotification.execute({
      content,
      recipient_id: '5887244798',
    });
  }
}
