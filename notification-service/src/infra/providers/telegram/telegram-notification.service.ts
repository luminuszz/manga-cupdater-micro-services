import {
  NotificationProvider,
  SendNotificationDto,
} from '@app/adapters/notification-provider';
import { Inject, Injectable } from '@nestjs/common';
import { TELEGRAF_PROVIDER_TOKEN } from '@infra/providers/telegram/telegraf.provider';
import { Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';

type MessageBody = {
  url: string;
  name: string;
  chapter: string | number;
  newChapter: string | number;
};

@Injectable()
export class TelegramNotificationService implements NotificationProvider {
  constructor(
    @Inject(TELEGRAF_PROVIDER_TOKEN)
    private readonly telegraf: Telegraf,
    private readonly configService: ConfigService,
  ) {}

  public createTelegramMessage({
    url,
    name,
    chapter,
    newChapter,
  }: MessageBody): string {
    return `
   ${name} - Capítulo Novo disponível - ${newChapter}!
    Cap Anterior: ${chapter}
    Novo Capítulo: ${newChapter}
    link -> ${url}
    `;
  }

  async sendNotification({ content }: SendNotificationDto): Promise<void> {
    await this.telegraf.telegram.sendMessage(
      this.configService.get<string>('TELEGRAM_CHAT_ID'),
      this.createTelegramMessage(JSON.parse(content)),
    );
  }
}
