import {
  Document as PrismaDocument,
  Status as PrismaStatus,
} from '@prisma/client';
import { Document, Status } from '@app/entities/document.entitiy';

export class PrismaDocumentMapper {
  static toDomain(prismaDocument: PrismaDocument): Document {
    const status: Status = PrismaDocumentMapper.parseStatusEnumToDomain(
      prismaDocument.status,
    );

    return new Document(
      {
        status,
        url: prismaDocument.url,
        createdAt: prismaDocument.createdAt,
        cap: prismaDocument.cap,
        category: 'manga',
        nextCap: undefined,
        name: prismaDocument.name,
        recipientId: prismaDocument.notion_id,
      },
      prismaDocument.id,
    );
  }

  static parseStatusEnumPrisma(status: Status): PrismaStatus {
    return status === 'read' ? PrismaStatus.READ : PrismaStatus.UNREAD;
  }

  static parseStatusEnumToDomain(status: PrismaStatus): Status {
    return status === PrismaStatus.READ ? 'read' : 'unread';
  }
}
