import { DocumentRepository } from '@app/repositories/document-repository';
import { Document } from '@app/entities/document.entitiy';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import {
  Status as PrismaStatus,
  Document as PrismaDocument,
} from '@prisma/client';
import { PrismaMapper } from '@infra/database/prisma/mappers/prisma.mapper';
import { omit } from 'lodash';

@Injectable()
export class PrismaDocumentRepository implements DocumentRepository {
  constructor(private readonly prisma: PrismaService) {}

  private logger = new Logger(PrismaDocumentRepository.name);

  async findDocumentByRecipentId(
    recipientId: string,
  ): Promise<Document | null> {
    const response = await this.prisma.document.findUnique({
      where: {
        recipient_id: recipientId,
      },
    });

    return response ? PrismaMapper.toDomain(response) : null;
  }

  async updateForNewChapter(id: string): Promise<void> {
    await this.prisma.document.update({
      where: {
        id,
      },
      data: {
        hasNewChapter: true,
      },
    });
  }

  async createDocument(document: Document): Promise<void> {
    await this.prisma.document.create({
      data: {
        createdAt: document.createdAt,
        id: document.id,
        status: PrismaMapper.parseStatusEnumPrisma(document.status),
        name: document.name,
        url: document.url,
        cap: document.cap,
        recipient_id: document.recipientId,
      },
    });
  }

  async findAllDocumentWithStatusFollowingWithHasNewChapterFalse(): Promise<
    Document[]
  > {
    const response = await this.prisma.document.findMany({
      where: {
        status: PrismaStatus.FOLLOWING,
        hasNewChapter: false,
      },
    });

    return response.map((item) => PrismaMapper.toDomain(item));
  }

  async findDocumentById(id: string): Promise<Document | null> {
    const response = await this.prisma.document.findUnique({
      where: {
        id,
      },
    });

    return response ? PrismaMapper.toDomain(response) : null;
  }

  async findDocumentByName(name: string): Promise<Document | null> {
    const response = await this.prisma.document.findUnique({
      where: {
        name,
      },
    });

    return response ? PrismaMapper.toDomain(response) : null;
  }

  async syncDatabase(documents: Document[]): Promise<void> {
    const operations = documents.map((document) => {
      const status = PrismaMapper.parseStatusEnumPrisma(document.status);

      const prismaDocument = {
        createdAt: document.createdAt,
        status: status,
        name: document.name,
        url: document.url,
        recipient_id: document.recipientId,
        cap: document.cap,
        hasNewChapter: document.hasNewchapter,
        image: document.image,
      } satisfies Omit<PrismaDocument, 'updatedAt' | 'id'>;

      this.logger.log(`Syncing document ${document.name} to prisma database`);

      const updatedPrismaDocument = omit(prismaDocument, ['cap']);

      return this.prisma.document.upsert({
        where: {
          recipient_id: prismaDocument.recipient_id,
        },
        create: prismaDocument,
        update: updatedPrismaDocument,
      });
    });

    await this.prisma.$transaction(operations);
  }

  async findaAllDocuments(): Promise<Document[]> {
    const reesponse = await this.prisma.document.findMany();

    return reesponse.map((item) => PrismaMapper.toDomain(item));
  }

  async findAllDocumentWithStatusFollowing(): Promise<Document[]> {
    const response = await this.prisma.document.findMany({
      where: {
        status: PrismaStatus.FOLLOWING,
      },
    });

    return response.map(PrismaMapper.toDomain);
  }

  async updateHasNewChapterForFalse(id: string): Promise<void> {
    await this.prisma.document.update({
      where: {
        id,
      },

      data: {
        hasNewChapter: false,
      },
    });
  }
  async updateHasNewChapterForTrue(id: string): Promise<void> {
    await this.prisma.document.update({
      where: {
        id,
      },

      data: {
        hasNewChapter: true,
      },
    });
  }
  async updateChapter(id: string, chapter: number): Promise<void> {
    await this.prisma.document.update({
      where: {
        id,
      },

      data: {
        cap: chapter,
      },
    });
  }
}
