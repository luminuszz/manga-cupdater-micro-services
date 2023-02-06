import { NotionPage } from '@infra/database/notion/dto/notion-page.dto';
import { Document, Status } from '../../../../core/entities/document.entitiy';

export type NotionDocument = {
  object: 'page';
};

type NotionStatus = 'Acompanhando' | 'Finzalizado' | 'Lendo' | 'Lerei';

export class NotionMapper {
  private static notionStatusToDomainMapper: Record<NotionStatus, Status> = {
    Acompanhando: 'following',
    Finzalizado: 'finished',
    Lendo: 'reading',
    Lerei: 'on_hold',
  };

  static toDomain({ properties, id }: NotionPage): Document {
    const parsedStatus =
      NotionMapper.notionStatusToDomainMapper[
        properties?.status?.select?.name || 'Lerei'
      ];

    return new Document({
      status: parsedStatus,
      hasNewchapter: properties['CAPITULO NOVO'].checkbox,
      cap: properties.cap.number || 0,
      category: (properties?.Tipo?.select?.name as any) || 'manga',
      name: properties?.Name?.title?.[0]?.text?.content,
      url: properties.URL.url,
      createdAt: new Date(properties.Created.created_time),
      nextCap: null,
      recipientId: id,
      image: properties?.image?.files?.[0]?.file?.url || null,
    });
  }

  static toNotion(document: Document): NotionDocument {
    return {
      ...(document as any),
    };
  }
}
