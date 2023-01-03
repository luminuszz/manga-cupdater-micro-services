import { DocumentRepository } from '@app/repositories/document-repository';
import { Inject, Injectable } from '@nestjs/common';
import { NOTION_CLIENT_PROVIDER_TOKEN } from '@infra/database/notion/notion-client.provider';
import { Client } from '@notionhq/client';
import { NotionPage } from '@infra/database/notion/dto/notion-page.dto';
import { NotionMapper } from '@infra/database/notion/mappers/notion-mapper';
import { Document, Status } from '@app/entities/document.entitiy';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotionDocumentRepository implements DocumentRepository {
  constructor(
    @Inject(NOTION_CLIENT_PROVIDER_TOKEN) private readonly notion: Client,

    private readonly configService: ConfigService<Env>,
  ) {}

  public async findDocumentById(id: string): Promise<Document | null> {
    const notionPage = (await this.notion.pages.retrieve({
      page_id: id,
    })) as NotionPage;

    return NotionMapper.toDomain(notionPage);
  }

  public async updateDocumentStatus(id: string, status: Status): Promise<void> {
    await this.notion.pages.update({
      page_id: id,
      properties: {
        'CAPITULO NOVO': {
          checkbox: status === 'unread',
        },
      },
    });
  }

  async createDocument(document: Document): Promise<void> {
    await this.notion.pages.create({ ...document } as any);
  }

  async findAllDocumentWithUnreadStatus(): Promise<Document[]> {
    const response = await this.notion.databases.query({
      database_id: this.configService.get('NOTION_DATABASE_ID'),
      filter: {
        and: [
          {
            property: 'CAPITULO NOVO',
            checkbox: {
              equals: false,
            },
          },
          {
            property: 'status',
            select: {
              equals: 'Acompanhando',
            },
          },
        ],
      },
    });

    return response.results.map((item) =>
      NotionMapper.toDomain(item as NotionPage),
    );
  }
}
