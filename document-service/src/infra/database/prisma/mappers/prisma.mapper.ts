import {
  Document as PrismaDocument,
  Status as PrismaStatus,
} from '@prisma/client';
import { Document, Status } from '../../../../core/entities/document.entitiy';

export class PrismaMapper {
  static toDomain(prismaDocument: PrismaDocument): Document {
    const status: Status = PrismaMapper.parseStatusEnumToDomain(
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
        hasNewchapter: prismaDocument.hasNewChapter,
        image: prismaDocument?.image,
      },
      prismaDocument.id,
    );
  }

  private static enumMapper: Record<Status, PrismaStatus> = {
    on_hold: PrismaStatus.ON_HOLD,
    reading: PrismaStatus.READING,
    finished: PrismaStatus.FINISHED,
    following: PrismaStatus.FOLLOWING,
  };

  static parseStatusEnumPrisma(status: Status): PrismaStatus {
    return PrismaMapper.enumMapper[status];
  }

  static parseStatusEnumToDomain(status: PrismaStatus): Status {
    return Object.keys(PrismaMapper.enumMapper).find(
      (item) => status.toLocaleLowerCase() === item,
    ) as Status;
  }
}
