import { DocumentRepository } from '../repositories/document-repository';
import { Document } from '@app/entities/document.entitiy';
import { Injectable } from '@nestjs/common';

type FindDocumentByIdInput = {
  id: string;
};

type FIndDocumentByIdOutput = {
  document: Document | null;
};

@Injectable()
export class FindDocumentById {
  constructor(private readonly documentRepository: DocumentRepository) {}

  async execute({
    id,
  }: FindDocumentByIdInput): Promise<FIndDocumentByIdOutput> {
    const document = await this.documentRepository.findDocumentById(id);

    return {
      document: document || null,
    };
  }
}
