import {
  NotificationProvider,
  SendNotificationDto,
} from '@app/ports/notification-provider';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { TelegrafProvider } from '@infra/adapters/notification/telegram/telegraf.provider';
import { ConfigService } from '@nestjs/config';
import { KafkaService } from '@infra/messaging/kafka.service';

@Injectable()
export class TelegramService implements NotificationProvider, OnModuleDestroy {
  constructor(private readonly telegraf: TelegrafProvider) {}

  private parseContentToTelegramMessage(content: string) {
    return content
      .replaceAll('_', '\\_')
      .replaceAll('**', '\\**')
      .replaceAll('[', '\\[')
      .replaceAll(']', '\\]')
      .replaceAll('`', '\\`')
      .replaceAll('-', '\\-')
      .replaceAll('(', '\\(')
      .replaceAll(')', '\\)')
      .replaceAll('.', '\\.')
      .replaceAll('!', '\\!')
      .replaceAll('>', '\\>')
      .replaceAll('<', '\\<');
  }

  async sendNotification({
    content,
    recipient_id,
  }: SendNotificationDto): Promise<void> {
    await this.telegraf.bot.telegram.sendMessage(
      recipient_id,
      this.parseContentToTelegramMessage(content),
      {
        parse_mode: 'MarkdownV2',
        entities: [
          {
            type: 'bold',
            offset: 201,
            length: 5,
          },
        ],
      },
    );
  }

  async onModuleDestroy(): Promise<void> {
    this.telegraf.bot.stop('finish provider lif cycle');
  }
}
