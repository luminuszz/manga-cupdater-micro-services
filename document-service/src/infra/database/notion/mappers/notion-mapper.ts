import { NotionPage } from '@infra/database/notion/dto/notion-page.dto';
import { Document, Status } from '@app/entities/document.entitiy';

export type NotionDocument = {
  object: 'page';
};

type NotionStatus = 'Acompanhando' | 'Finzalizado' | 'Lendo' | 'Lerei';

export class NotionMapper {
  private static notionStatusToDomainMapper: Record<NotionStatus, Status> = {
    Acompanhando: 'unread',
    Finzalizado: 'finished',
    Lendo: 'reading',
    Lerei: 'on_hold',
  };

  static toDomain(notionDocument: NotionPage): Document {
    const parsedStatus =
      NotionMapper.notionStatusToDomainMapper[
        notionDocument.properties?.status?.select?.name || 'Lerei'
      ];

    return new Document({
      status: parsedStatus,
      id: notionDocument.id,
      cap: notionDocument.properties.cap.number || 0,
      category:
        (notionDocument.properties?.Tipo?.select?.name as any) || 'manga',
      name: notionDocument?.properties?.Name?.title?.[0]?.text?.content,
      url: notionDocument.properties.URL.url,
      createdAt: new Date(notionDocument.properties.Created.created_time),
      nextCap: null,
      recipientId: notionDocument.id,
    });
  }

  static toNotion(document: Document): NotionDocument {
    return {
      ...(document as any),
    };
  }
}
