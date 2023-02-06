import { Injectable, Logger } from '@nestjs/common';
import { NotionDocumentRepository } from '@infra/database/notion/repositories/notion-document-repository';
import { PrismaDocumentRepository } from '@infra/database/prisma/repositories/prisma-document.repository';

type Operation = 'marksAsRead' | 'marksAsUnread';

@Injectable()
export class SyncNotionDatabaseBatch {
  constructor(
    private readonly notionDocumentRepository: NotionDocumentRepository,
    private readonly prismaDocumentRepository: PrismaDocumentRepository,
  ) {}

  private logger = new Logger(SyncNotionDatabaseBatch.name);

  async execute(id: string, operation: Operation, chapter?: number) {
    const document = await this.prismaDocumentRepository.findDocumentById(id);

    if (document) {
      if (operation === 'marksAsUnread') {
        await this.notionDocumentRepository.updateHasNewChapterForTrue(
          document.recipientId,
        );
      } else {
        await this.notionDocumentRepository.updateHasNewChapterForFalse(
          document.recipientId,
        );

        if (chapter) {
          await this.notionDocumentRepository.updateChapter(
            document.recipientId,
            chapter,
          );
        }
      }

      this.logger.log(
        `Document ${document.name} updated hasNewChapter for "CAPITULO NOVO": ${document.hasNewchapter}  status in Notion database`,
      );
    }
  }
}
