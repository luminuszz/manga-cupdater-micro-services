import { DocumentRepository } from '../repositories/document-repository';
import { Document } from '@app/entities/document.entitiy';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindDocumentById {
  constructor(private readonly documentRepository: DocumentRepository) {}

  async execute(id: string): Promise<Document | null> {
    const document = await this.documentRepository.findDocumentById(id);

    return document ? document : null;
  }
}
