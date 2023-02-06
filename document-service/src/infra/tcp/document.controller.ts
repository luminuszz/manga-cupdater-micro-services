import { Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { FindDocumentById } from '@core/useCases/find-document-by-id';

import { FindAllDocumentsWithFollowingStatusWithHasNewChapterFalse } from '@core/useCases/find-all-documents-with-following-status-with-hasNewChapterFalse';
import { FindDocumentByName } from '@core/useCases/find-document-by-name';
import { SyncPrismaToNotionBatch } from '@infra/batchs/syncPrismaToNotion.batch';
import { SyncNotionDatabaseBatch } from '@infra/batchs/syncNotionDatabase.batch';
import { FindAllDocumentsWithUnfollowStatus } from '@core/useCases/find-all-documents-with-unfollow-status';

import { MarkDocumentToUnread } from '@core/useCases/mark-document-to-unread';
import { MarkDocumentToRead } from '@core/useCases/mark-document-to-read';

type MarkDocumentToReadEvent = {
  id: string;
  chapter: number;
};

type MarkDocumentToUreadEvent = {
  id: string;
};

type FindDocumentByIdEvent = {
  id: string;
};

type FindDocumentByNameEvent = {
  name: string;
};

@Controller()
export class DocumentController {
  private logger = new Logger(DocumentController.name);
  constructor(
    private readonly findDocumentById: FindDocumentById,

    private readonly findAllDocumentsUnread: FindAllDocumentsWithFollowingStatusWithHasNewChapterFalse,
    private findDocumentByName: FindDocumentByName,
    private readonly syncPrismaToNotionBatch: SyncPrismaToNotionBatch,
    private readonly findAllDocumentsWithUnfollowStatus: FindAllDocumentsWithUnfollowStatus,
    private readonly markDocumentToUnread: MarkDocumentToUnread,
    private readonly markDocumentToRead: MarkDocumentToRead,

    private readonly syncNotionDatabase: SyncNotionDatabaseBatch,
  ) {}

  @MessagePattern('document.getById')
  async getDocumentById(@Payload() { id }: FindDocumentByIdEvent) {
    this.logger.log(
      `recvied message with id ${id} -> document.getById -> ${new Date()}`,
    );

    return this.findDocumentById.execute({
      id,
    });
  }

  @MessagePattern('document.findAllUnread')
  async findAllWithUnreadStatus() {
    this.logger.log(
      `recvied message  -> document.findAllUnread -> ${new Date()}`,
    );

    return await this.findAllDocumentsUnread.execute();
  }

  @MessagePattern('document.findByName')
  async findDocumentByNameAction(@Payload() { name }: FindDocumentByNameEvent) {
    this.logger.log(
      `recvied message wih id ${name}  -> document.findByName -> ${new Date()}`,
    );

    return await this.findDocumentByName.execute({
      name,
    });
  }

  @MessagePattern('document.findAllWithUnfollowStatus')
  async findAllWithUnfollowStatus() {
    this.logger.log(
      `recvied message -> document.findAllWithUnfollowStatus -> ${new Date()}`,
    );

    return this.findAllDocumentsWithUnfollowStatus.exceute();
  }

  @EventPattern('scraping.newChapterFound')
  async onNewChapterFound(@Payload() payload: MarkDocumentToUreadEvent) {
    this.logger.log(
      `recvied message with id ${
        payload.id
      } -> scraping.newChapterFound -> ${new Date()}`,
    );

    await this.markDocumentToUnread.execute({
      id: payload.id,
    });

    await this.syncNotionDatabase.execute(payload.id, 'marksAsUnread');
  }

  @EventPattern('document.markAsRead')
  async updateDocumentStatus(@Payload() payload: MarkDocumentToReadEvent) {
    this.logger.log(
      `recvied message with id ${
        payload.id
      } -> document.markAsRead -> ${new Date()}`,
    );

    await this.markDocumentToRead.execute({
      id: payload.id,
      chapter: payload.chapter,
    });

    await this.syncNotionDatabase.execute(
      payload.id,
      'marksAsRead',
      payload.chapter,
    );
  }

  @EventPattern('tasks.jobs.syncDatabase')
  async syncNotion() {
    this.logger.log(`recvied message -> document.sync.notion -> ${new Date()}`);

    await this.syncPrismaToNotionBatch.execute();
  }
}
