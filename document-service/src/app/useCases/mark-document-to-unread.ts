import { DocumentRepository } from '@app/repositories/document-repository';
import { NotFoundDocumentError } from '@app/useCases/errors/not-found-document-error';
import { Injectable } from '@nestjs/common';

interface MarkDocumentToUnreadInput {
  id: string;
}

@Injectable()
export class MarkDocumentToUnread {
  constructor(private readonly documentRepository: DocumentRepository) {}
  async execute({ id }: MarkDocumentToUnreadInput) {
    const document = await this.documentRepository.findDocumentById(id);

    if (!document) {
      throw new NotFoundDocumentError();
    }

    await this.documentRepository.updateHasNewChapterForTrue(document.id);
  }
}
