import { NotionPage } from '@infra/database/notion/dto/notion-page.dto';
import { Document } from '@app/entities/document.entitiy';

export type NotionDocument = {
  object: 'page';
};

export class NotionMapper {
  static toDomain(notionDocument: NotionPage): Document {
    const parsedStatus = notionDocument.properties['CAPITULO NOVO'].checkbox
      ? 'unread'
      : 'read';

    return new Document(
      {
        status: parsedStatus,
        id: notionDocument.id,
        cap: notionDocument.properties.cap.number,
        category: notionDocument.properties.Tipo.select.name as any,
        name: notionDocument.properties.Name.title[0].plain_text,
        url: notionDocument.properties.URL.url,
        createdAt: new Date(notionDocument.properties.Created.created_time),
        nextCap: null,
        recipientId: notionDocument.id,
      },
      notionDocument.id,
    );
  }

  static toNotion(document: Document): NotionDocument {
    return {
      ...(document as any),
    };
  }
}
