import { DocumentRepository } from '@app/repositories/document-repository';
import { Document, Status } from '@app/entities/document.entitiy';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import {
  Status as PrismaStatus,
  Document as PrismaDocument,
} from '@prisma/client';
import { PrismaDocumentMapper } from '@infra/database/prisma/mappers/prisma-document-mapper';

@Injectable()
export class PrismaDocumentRepository implements DocumentRepository {
  private logger = new Logger(PrismaDocumentRepository.name);

  async findDocumentByRecipentId(
    recipientId: string,
  ): Promise<Document | null> {
    const response = await this.prisma.document.findUnique({
      where: {
        notion_id: recipientId,
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
        notion_id: document.recipientId,
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
      const prismaDocument = {
        createdAt: document.createdAt,
        status: PrismaDocumentMapper.parseStatusEnumPrisma(document.status),
        name: document.name,
        url: document.url,
        notion_id: document.recipientId,
        cap: document.cap,
        hasNewChapter:
          PrismaDocumentMapper.parseStatusEnumPrisma(document.status) ===
          PrismaStatus.UNREAD,
      } satisfies Omit<PrismaDocument, 'updatedAt' | 'id'>;

      this.logger.log(`Syncing document ${document.name} to prisma database`);

      return this.prisma.document.upsert({
        where: {
          notion_id: prismaDocument.notion_id,
        },
        create: prismaDocument,
        update: prismaDocument,
      });
    });

    await this.prisma.$transaction(operations);
  }
}
