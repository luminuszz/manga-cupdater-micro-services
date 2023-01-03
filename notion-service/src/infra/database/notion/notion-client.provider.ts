import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@notionhq/client';

export const NOTION_CLIENT_PROVIDER_TOKEN = 'NOTION_CLIENT_PROVIDER_TOKEN';

export const NotionClientProvider: Provider = {
  provide: NOTION_CLIENT_PROVIDER_TOKEN,
  useFactory: (config: ConfigService<Env>) => {
    return new Client({
      auth: config.get('NOTION_AUTH_TOKEN'),
    });
  },
  inject: [ConfigService],
};
