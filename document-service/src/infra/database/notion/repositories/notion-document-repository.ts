import { DocumentRepository } from '@core/repositories/document.repository';
import { Inject, Injectable } from '@nestjs/common';
import { NOTION_CLIENT_PROVIDER_TOKEN } from '@infra/database/notion/notion-client.provider';
import { Client } from '@notionhq/client';
import { NotionPage } from '@infra/database/notion/dto/notion-page.dto';
import { NotionMapper } from '@infra/database/notion/mappers/notion-mapper';
import { Document } from '@core/entities/document.entitiy';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotionDocumentRepository implements DocumentRepository {
  async findDocumentByRecipentId(
    recipientId: string,
  ): Promise<Document | null> {
    const response = await this.notion.pages.retrieve({
      page_id: recipientId,
    });

    return NotionMapper.toDomain(response as NotionPage);
  }
  constructor(
    @Inject(NOTION_CLIENT_PROVIDER_TOKEN)
    private readonly notion: Client,

    private readonly configService: ConfigService<Env>,
  ) {}

  public async findDocumentById(id: string): Promise<Document | null> {
    const notionPage = (await this.notion.pages.retrieve({
      page_id: id,
    })) as NotionPage;

    return NotionMapper.toDomain(notionPage);
  }

  public async updateForNewChapter(id: string): Promise<void> {
    await this.notion.pages.update({
      page_id: id,
      properties: {
        'CAPITULO NOVO': {
          checkbox: true,
        },
      },
    });
  }

  async createDocument(document: Document): Promise<void> {
    await this.notion.pages.create({ ...document } as any);
  }

  async findAllDocumentWithStatusFollowingWithHasNewChapterFalse(): Promise<
    Document[]
  > {
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

  async findDocumentByName(name: string): Promise<Document | null> {
    const { results } = await this.notion.databases.query({
      database_id: this.configService.get('NOTION_DATABASE_ID'),

      filter: {
        property: 'Name',
        title: {
          contains: name,
        },
      },
    });

    return results?.length
      ? NotionMapper.toDomain(results[0] as NotionPage)
      : null;
  }

  async findaAllDocuments(): Promise<Document[]> {
    const response = await this.notion.databases.query({
      database_id: this.configService.get('NOTION_DATABASE_ID'),
      filter: {
        property: 'Name',
        title: {
          is_not_empty: true,
        },
      },
    });

    return response.results.map((item) =>
      NotionMapper.toDomain(item as NotionPage),
    );
  }

  async findAllDocumentWithStatusFollowing(): Promise<Document[]> {
    const response = await this.notion.databases.query({
      database_id: this.configService.get('NOTION_DATABASE_ID'),
      filter: {
        property: 'status',
        select: {
          equals: 'Acompanhando',
        },
      },
    });

    return response.results.map((item) =>
      NotionMapper.toDomain(item as NotionPage),
    );
  }

  async updateChapter(id: string, chapter: number): Promise<void> {
    await this.notion.pages.update({
      page_id: id,
      properties: {
        cap: {
          number: chapter,
        },
      },
    });
  }

  async updateHasNewChapterForFalse(id: string): Promise<void> {
    await this.notion.pages.update({
      page_id: id,
      properties: {
        'CAPITULO NOVO': {
          checkbox: false,
        },
      },
    });
  }

  async updateHasNewChapterForTrue(id: string): Promise<void> {
    await this.notion.pages.update({
      page_id: id,
      properties: {
        'CAPITULO NOVO': {
          checkbox: true,
        },
      },
    });
  }
}
