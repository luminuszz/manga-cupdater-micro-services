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
        recipientId: prismaDocument.recipient_id,
      },
      prismaDocument.id,
    );
  }

  private static enumMapper: Record<Status, PrismaStatus> = {
    on_hold: PrismaStatus.ON_HOLD,
    read: PrismaStatus.READ,
    reading: PrismaStatus.READING,
    unread: PrismaStatus.UNREAD,
    finished: PrismaStatus.FINISHED,
  };

  static parseStatusEnumPrisma(status: Status): PrismaStatus {
    return PrismaDocumentMapper.enumMapper[status];
  }

  static parseStatusEnumToDomain(status: PrismaStatus): Status {
    return Object.keys(PrismaDocumentMapper.enumMapper).find(
      (item) => status.toLocaleLowerCase() === item,
    ) as Status;
  }
}
