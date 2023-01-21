import {
  NotificationProvider,
  SendNotificationDto,
} from '@app/ports/notification-provider';
import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { TELEGRAF_PROVIDER_TOKEN } from '@infra/adapters/notification/telegram/telegraf.provider';
import { Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import { FindDocumentByNameResposeEvent } from '@infra/adapters/notification/telegram/dto/find-document-by-name-respose-event';
import { KafkaService } from '@infra/messaging/kafka.service';

type MessageBody = {
  url: string;
  name: string;
  chapter: string | number;
  newChapter: string | number;
};

@Injectable()
export class TelegramService
  implements NotificationProvider, OnModuleDestroy, OnModuleInit
{
  constructor(
    @Inject(TELEGRAF_PROVIDER_TOKEN)
    private readonly telegraf: Telegraf,
    private readonly configService: ConfigService,
    private readonly brokerService: KafkaService,
  ) {
    this.telegraf.command('finishCap', this.onChapterRead.bind(this));
  }

  public createTelegramMessage({ url, name, newChapter }: MessageBody): string {
    return `
   ${name} - Capítulo Novo disponível - ${newChapter} !
    Novo Capítulo: ${newChapter}
    link -> ${url}
    `;
  }

  public async onChapterRead(ctx: any) {
    const [name, chapter] = ctx.message.text
      .replace('/finishCap ', '')
      .split(',');

    this.brokerService
      .send('document.findByName', {
        name,
      })
      .subscribe((response: FindDocumentByNameResposeEvent) => {
        if (response.document) {
          const { name, id } = response.document.props;

          const payload = {
            id: id,
            status: 'read',
            newChapter: Number(chapter) || undefined,
          };

          this.brokerService.emit('document.updateStatus', payload);

          ctx.reply(`Capítulo marcado como lido ! -> ${name}`);

          return;
        }
        ctx.reply(`Obra não encontrada ! -> ${name}`);
      });
  }

  async sendNotification({ content }: SendNotificationDto): Promise<void> {
    await this.telegraf.telegram.sendMessage(
      this.configService.get<string>('TELEGRAM_CHAT_ID'),
      this.createTelegramMessage(JSON.parse(content)),
    );
  }

  async onModuleInit() {
    this.brokerService.subscribeToResponseOf('document.findByName');

    await this.brokerService.connect();
  }

  async onModuleDestroy(): Promise<void> {
    this.telegraf.stop('finish provider lif cycle');
  }
}
