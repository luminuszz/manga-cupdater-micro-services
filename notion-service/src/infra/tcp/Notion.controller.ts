import { Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { FindDocumentById } from '@app/useCases/find-document-by-id';
import { UpdateToReadDocumentStatus } from '@app/useCases/update-to-read-document-status';
import { Status } from '@app/entities/document.entitiy';
import { FindAllDocumentsUnread } from '@app/useCases/find-all-documents-unread';
import { FindDocumentByName } from '@app/useCases/find-document-by-name';

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
export class NotionController {
  private logger = new Logger(NotionController.name);
  constructor(
    private readonly findDocumentById: FindDocumentById,
    private readonly updateToReadDocumentStatus: UpdateToReadDocumentStatus,
    private readonly findAllDocumentsUnread: FindAllDocumentsUnread,
    private findDocumentByName: FindDocumentByName,
  ) {}
  @MessagePattern('document.getById')
  async getDocumentById(@Payload() { id }: FindDocumentByIdEvent) {
    this.logger.log(
      `recvied message with id ${id} -> document.getById -> ${new Date()}`,
    );

    return await this.findDocumentById.execute(id);
  }

  @EventPattern('document.updateStatus')
  async updateDocumentStatus(
    @Payload()
    { id, status, newChapter }: UpdateDocumentStatusEvent,
  ) {
    this.logger.log(
      `recvied message with id ${id} -> document.updateStatus -> ${new Date()}`,
    );

    await this.updateToReadDocumentStatus.execute({ id, status, newChapter });
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
}
