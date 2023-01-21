import { Module } from '@nestjs/common';
import { telegrafProviderResolver } from '@infra/adapters/notification/telegram/telegraf.provider';
import { TelegramService } from '@infra/adapters/notification/telegram/telegram.service';
import { MessagingModule } from '@infra/messaging/messaging.module';

@Module({
  imports: [MessagingModule],
  providers: [telegrafProviderResolver, TelegramService],
  exports: [TelegramService, telegrafProviderResolver],
})
export class TelegramModule {}
