import { Injectable } from '@nestjs/common';
import { DocumentRepository } from '@core/repositories/document.repository';
import { NotFoundDocumentError } from '../useCases/errors/not-found-document-error';

interface MarkNewChapterReadInput {
  id: string;
  chapter: number;
}

@Injectable()
export class MarkDocumentToRead {
  constructor(private readonly documentRepository: DocumentRepository) {}

  async execute({ id, chapter }: MarkNewChapterReadInput) {
    const document = await this.documentRepository.findDocumentById(id);

    if (!document) {
      throw new NotFoundDocumentError();
    }

    await this.documentRepository.updateHasNewChapterForFalse(document.id);

    await this.documentRepository.updateChapter(document.id, chapter);
  }
}
