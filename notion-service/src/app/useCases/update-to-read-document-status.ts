import { DocumentRepository } from '@app/repositories/document-repository';
import { UpdateToReadDocumentStatusDto } from '@app/dto/update-to-read-document-status-dto';
import { NotFoundDocumentError } from '@app/useCases/errors/not-found-document-error';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdateToReadDocumentStatus {
  constructor(private readonly documentRepository: DocumentRepository) {}
  async execute({ status, id }: UpdateToReadDocumentStatusDto) {
    const document = await this.documentRepository.findDocumentById(id);

    if (!document) {
      throw new NotFoundDocumentError();
    }

    await this.documentRepository.updateDocumentStatus(document.id, status);
  }
}
