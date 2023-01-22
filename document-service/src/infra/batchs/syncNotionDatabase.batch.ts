import { Injectable, Logger } from '@nestjs/common';
import { NotionDocumentRepository } from '@infra/database/notion/repositories/notion-document-repository';
import { Status } from '@app/entities/document.entitiy';
import { PrismaDocumentRepository } from '@infra/database/prisma/repositories/prisma-document.repository';

@Injectable()
export class SyncNotionDatabaseBatch {
  constructor(
    private readonly notionDocumentRepository: NotionDocumentRepository,
    private readonly prismaDocumentRepository: PrismaDocumentRepository,
  ) {}

  private logger = new Logger(SyncNotionDatabaseBatch.name);

  async execute(id: string, status: Status) {
    const document = await this.prismaDocumentRepository.findDocumentById(id);

    if (document) {
      await this.notionDocumentRepository.updateDocumentStatus(
        document.recipientId,
        status,
      );

      this.logger.log(
        `Document ${document.name} updated to ${status} status in Notion database`,
      );
    }
  }
}
