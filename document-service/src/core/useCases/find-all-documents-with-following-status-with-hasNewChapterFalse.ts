import { DocumentRepository } from '@core/repositories/document.repository';
import { Document } from '../entities/document.entitiy';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindAllDocumentsWithFollowingStatusWithHasNewChapterFalse {
  constructor(private readonly documentRepository: DocumentRepository) {}

  async execute(): Promise<Document[]> {
    return this.documentRepository.findAllDocumentWithStatusFollowingWithHasNewChapterFalse();
  }
}
