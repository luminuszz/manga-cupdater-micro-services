import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';

export const TELEGRAF_PROVIDER_TOKEN = 'TELEGRAF_PROVIDER_TOKEN';

export class TelegrafProvider {
  private static bot: Telegraf;

  static getInstance(configService: ConfigService): Telegraf {
    if (!TelegrafProvider.bot) {
      TelegrafProvider.bot = new Telegraf(
        configService.get('TELEGRAM_NOTIFICATION_BOT'),
      );

      this.bot.launch().then(() => {});
    }

    return TelegrafProvider.bot;
  }
}

export const telegrafProviderResolver: Provider = {
  provide: TELEGRAF_PROVIDER_TOKEN,
  useFactory: (configService: ConfigService) =>
    TelegrafProvider.getInstance(configService),

  inject: [ConfigService],
};
