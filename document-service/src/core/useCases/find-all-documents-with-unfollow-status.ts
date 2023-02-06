import { Injectable } from '@nestjs/common';
import { DocumentRepository } from '@core/repositories/document.repository';

@Injectable()
export class FindAllDocumentsWithUnfollowStatus {
  constructor(private readonly documentRepository: DocumentRepository) {}

  async exceute() {
    return this.documentRepository.findAllDocumentWithStatusFollowing();
  }
}
