import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { FindDocumentById } from '@app/useCases/find-document-by-id';
import { UpdateToReadDocumentStatus } from '@app/useCases/update-to-read-document-status';
import { Status } from '@app/entities/document.entitiy';
import { FindAllDocumentsUnread } from '@app/useCases/find-all-documents-unread';

@Controller()
export class NotionController {
  constructor(
    private readonly findDocumentById: FindDocumentById,
    private readonly updateToReadDocumentStatus: UpdateToReadDocumentStatus,

    private readonly findAllDocumentsUnread: FindAllDocumentsUnread,
  ) {}
  @MessagePattern('document.getById')
  async getDocumentById(@Payload() { id }: { id: string }) {
    const response = await this.findDocumentById.execute(id);

    console.log('response', response);

    return response;
  }

  @EventPattern('document.updateStatus')
  async updateDocumentStatus(
    @Payload() { id, status }: { id: string; status: Status },
  ) {
    await this.updateToReadDocumentStatus.execute({ id, status });
  }

  @MessagePattern('document.findAllUnread')
  async findAllWithUnreadStatus() {
    return await this.findAllDocumentsUnread.execute();
  }
}
