import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';

export const TELEGRAF_PROVIDER_TOKEN = 'TELEGRAF_PROVIDER_TOKEN';

export const TelegrafSdkProvider: Provider = {
  provide: TELEGRAF_PROVIDER_TOKEN,
  useFactory: (configService: ConfigService) => {
    return new Telegraf(configService.get<string>('TELEGRAM_NOTIFICATION_BOT'));
  },

  inject: [ConfigService],
};
