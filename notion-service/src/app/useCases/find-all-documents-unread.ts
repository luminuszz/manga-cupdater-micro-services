import { DocumentRepository } from '@app/repositories/document-repository';
import { Document } from '@app/entities/document.entitiy';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindAllDocumentsUnread {
  constructor(private readonly documentRepository: DocumentRepository) {}

  async execute(): Promise<Document[]> {
    console.log('FindAllDocumentsUnread');

    return this.documentRepository.findAllDocumentWithUnreadStatus();
  }
}
