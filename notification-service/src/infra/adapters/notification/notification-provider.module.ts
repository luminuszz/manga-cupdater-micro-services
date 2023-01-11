import { Module } from '@nestjs/common';
import { NotificationProvider } from '@app/ports/notification-provider';
import { TelegramNotificationService } from '@infra/adapters/notification/telegram/telegram-notification.service';
import { TelegrafSdkProvider } from '@infra/adapters/notification/telegram/telegraf.provider';
import { BrokerProvider } from '@infra/adapters/broker.provider';

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
