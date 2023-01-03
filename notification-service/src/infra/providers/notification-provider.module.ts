import { Module } from '@nestjs/common';
import { NotificationProvider } from '@app/adapters/notification-provider';
import { TelegramNotificationService } from '@infra/providers/telegram/telegram-notification.service';
import { TelegrafSdkProvider } from '@infra/providers/telegram/telegraf.provider';
import { BrokerProvider } from '@infra/providers/broker.provider';

@Module({
  providers: [
    TelegrafSdkProvider,
    BrokerProvider,
    {
      provide: NotificationProvider,
      useClass: TelegramNotificationService,
    },
  ],

  exports: [NotificationProvider],
})
export class NotificationProviderModule {}
