import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client as NotionClient } from '@notionhq/client';

@Injectable()
export class NotionClientProvider extends NotionClient {
  public readonly databaseId: string;

  constructor(private readonly configService: ConfigService) {
    super({
      auth: configService.get('NOTION_AUTH_TOKEN'),
    });

    this.databaseId = configService.get('NOTION_DATABASE_ID');
  }
}
