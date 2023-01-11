import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { FindDocumentById } from '@app/useCases/find-document-by-id';
import { UpdateToReadDocumentStatus } from '@app/useCases/update-to-read-document-status';
import { Status } from '@app/entities/document.entitiy';
import { FindAllDocumentsUnread } from '@app/useCases/find-all-documents-unread';
import { FindDocumentByName } from '@app/useCases/find-document-by-name';

@Controller()
export class NotionController {
  constructor(
    private readonly findDocumentById: FindDocumentById,
    private readonly updateToReadDocumentStatus: UpdateToReadDocumentStatus,

    private readonly findAllDocumentsUnread: FindAllDocumentsUnread,

    private findDocumentByName: FindDocumentByName,
  ) {}
  @MessagePattern('document.getById')
  async getDocumentById(@Payload() { id }: { id: string }) {
    const response = await this.findDocumentById.execute(id);

    console.log('response', response);

    return response;
  }

  @EventPattern('document.updateStatus')
  async updateDocumentStatus(
    @Payload()
    {
      id,
      status,
      newChapter,
    }: {
      id: string;
      status: Status;
      newChapter?: number;
    },
  ) {
    await this.updateToReadDocumentStatus.execute({ id, status, newChapter });
  }

  @MessagePattern('document.findAllUnread')
  async findAllWithUnreadStatus() {
    return await this.findAllDocumentsUnread.execute();
  }

  @MessagePattern('document.findByName')
  async findDocumentByNameAction(@Payload() { name }: { name: string }) {
    return await this.findDocumentByName.execute({
      name,
    });
  }
}
