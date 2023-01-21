import { Injectable } from '@nestjs/common';
import { PrismaDocumentRepository } from '@infra/database/prisma/repositories/prisma-document.repository';
import { NotionDocumentRepository } from '@infra/database/notion/repositories/notion-document-repository';

@Injectable()
export class SyncPrismaToNotionBatch {
  constructor(
    private readonly prismaDocumentRepository: PrismaDocumentRepository,
    private readonly notionDocumentRepository: NotionDocumentRepository,
  ) {}

  async execute() {
    const notionData =
      await this.notionDocumentRepository.findAllDocumentWithUnreadStatus();

    await this.prismaDocumentRepository.syncDatabase(notionData);
  }
}
