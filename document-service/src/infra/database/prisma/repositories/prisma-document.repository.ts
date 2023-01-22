import { DocumentRepository } from '@app/repositories/document-repository';
import { Document, Status } from '@app/entities/document.entitiy';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import {
  Status as PrismaStatus,
  Document as PrismaDocument,
} from '@prisma/client';
import { PrismaDocumentMapper } from '@infra/database/prisma/mappers/prisma-document-mapper';
import { omit } from 'lodash';

@Injectable()
export class PrismaDocumentRepository implements DocumentRepository {
  private logger = new Logger(PrismaDocumentRepository.name);

  async findDocumentByRecipentId(
    recipientId: string,
  ): Promise<Document | null> {
    const response = await this.prisma.document.findUnique({
      where: {
        recipient_id: recipientId,
      },
    });

    return response ? PrismaDocumentMapper.toDomain(response) : null;
  }

  async updateDocumentStatus(
    id: string,
    status: Status,
    chapter?: number,
  ): Promise<void> {
    await this.prisma.document.update({
      where: {
        id,
      },
      data: {
        status: PrismaDocumentMapper.parseStatusEnumPrisma(status),
        cap: chapter,
        hasNewChapter:
          PrismaDocumentMapper.parseStatusEnumPrisma(status) ===
          PrismaStatus.UNREAD,
      },
    });
  }
  constructor(private readonly prisma: PrismaService) {}

  async createDocument(document: Document): Promise<void> {
    await this.prisma.document.create({
      data: {
        createdAt: document.createdAt,
        id: document.id,
        status: PrismaDocumentMapper.parseStatusEnumPrisma(document.status),
        name: document.name,
        url: document.url,
        cap: document.cap,
        recipient_id: document.recipientId,
      },
    });
  }

  async findAllDocumentWithUnreadStatus(): Promise<Document[]> {
    const response = await this.prisma.document.findMany({
      where: {
        status: PrismaStatus.READ,
      },
    });

    return response.map((item) => PrismaDocumentMapper.toDomain(item));
  }

  async findDocumentById(id: string): Promise<Document | null> {
    const response = await this.prisma.document.findUnique({
      where: {
        id,
      },
    });

    return response ? PrismaDocumentMapper.toDomain(response) : null;
  }

  async findDocumentByName(name: string): Promise<Document | null> {
    const response = await this.prisma.document.findUnique({
      where: {
        name,
      },
    });

    return response ? PrismaDocumentMapper.toDomain(response) : null;
  }

  async syncDatabase(documents: Document[]): Promise<void> {
    const operations = documents.map((document) => {
      const status = PrismaDocumentMapper.parseStatusEnumPrisma(
        document.status,
      );

      const prismaDocument = {
        createdAt: document.createdAt,
        status: status,
        name: document.name,
        url: document.url,
        recipient_id: document.recipientId,
        cap: document.cap,
        hasNewChapter: status === PrismaStatus.UNREAD,
      } satisfies Omit<PrismaDocument, 'updatedAt' | 'id'>;

      this.logger.log(`Syncing document ${document.name} to prisma database`);

      const updatedPrismaDocument = omit(prismaDocument, ['cap']);

      return this.prisma.document.upsert({
        where: {
          recipient_id: prismaDocument.recipient_id,
        },
        create: prismaDocument,
        update: {
          ...updatedPrismaDocument,
        },
      });
    });

    await this.prisma.$transaction(operations);
  }

  async findaAllDocuments(): Promise<Document[]> {
    const reesponse = await this.prisma.document.findMany();

    return reesponse.map((item) => PrismaDocumentMapper.toDomain(item));
  }
}
