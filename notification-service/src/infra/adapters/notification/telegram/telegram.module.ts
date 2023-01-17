import { Module } from '@nestjs/common';
import { telegrafProviderResolver } from '@infra/adapters/notification/telegram/telegraf.provider';
import { TelegramService } from '@infra/adapters/notification/telegram/telegram.service';
import { BrokerProvider } from '@infra/tcp/broker.provider';

@Module({
  imports: [],
  providers: [telegrafProviderResolver, TelegramService, BrokerProvider],
  exports: [TelegramService, telegrafProviderResolver, BrokerProvider],
})
export class TelegramModule {}
