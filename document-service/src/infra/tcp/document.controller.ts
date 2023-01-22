import { Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { FindDocumentById } from '@app/useCases/find-document-by-id';
import { UpdateToReadDocumentStatus } from '@app/useCases/update-to-read-document-status';
import { Status } from '@app/entities/document.entitiy';
import { FindAllDocumentsUnread } from '@app/useCases/find-all-documents-unread';
import { FindDocumentByName } from '@app/useCases/find-document-by-name';
import { SyncPrismaToNotionBatch } from '@infra/batchs/syncPrismaToNotion.batch';
import { NotionDocumentRepository } from '@infra/database/notion/repositories/notion-document-repository';
import { SyncNotionDatabaseBatch } from '@infra/batchs/syncNotionDatabase.batch';

type UpdateDocumentStatusEvent = {
  id: string;
  status: Status;
  newChapter?: number;
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
    private readonly updateToReadDocumentStatus: UpdateToReadDocumentStatus,
    private readonly findAllDocumentsUnread: FindAllDocumentsUnread,
    private findDocumentByName: FindDocumentByName,
    private readonly syncPrismaToNotionBatch: SyncPrismaToNotionBatch,

    private readonly syncNotionDatabase: SyncNotionDatabaseBatch,
  ) {}
  @MessagePattern('document.getById')
  async getDocumentById(@Payload() { id }: FindDocumentByIdEvent) {
    this.logger.log(
      `recvied message with id ${id} -> document.getById -> ${new Date()}`,
    );

    return await this.findDocumentById.execute(id);
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

  @EventPattern('scraping.newChapterFound')
  async onNewChapterFound(@Payload() payload: UpdateDocumentStatusEvent) {
    this.logger.log(
      `recvied message with id ${
        payload.id
      } -> scraping.newChapterFound -> ${new Date()}`,
    );

    await this.updateToReadDocumentStatus.execute(payload);

    await this.syncNotionDatabase.execute(payload.id, payload.status);
  }

  @EventPattern('tasks.jobs.syncDatabase')
  async syncNotion() {
    this.logger.log(`recvied message -> document.sync.notion -> ${new Date()}`);

    await this.syncPrismaToNotionBatch.execute();
  }
}
