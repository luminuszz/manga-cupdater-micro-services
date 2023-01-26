import { DocumentRepository } from '@app/repositories/document-repository';
import { Injectable } from '@nestjs/common';
import { Status, Document } from '@app/entities/document.entitiy';
import { DocumentAlreadyExistsError } from '@app/useCases/errors/document-already-exists.error';

type CreateDocumentInput = {
  name: string;
  cap: number;
  url: string;
  createdAt: Date;
  recipientId: string;
  status: Status;
  id?: string;
  image?: string;
};

@Injectable()
export class CreateDocument {
  constructor(private readonly documentRepository: DocumentRepository) {}

  async execute(data: CreateDocumentInput) {
    const documentWithRecipientId =
      await this.documentRepository.findDocumentByRecipentId(data.recipientId);

    if (documentWithRecipientId) throw new DocumentAlreadyExistsError();

    const documentWithName = await this.documentRepository.findDocumentByName(
      data.name,
    );

    if (documentWithName) throw new DocumentAlreadyExistsError();

    const newDocument = new Document(
      {
        createdAt: data.createdAt,
        name: data.name,
        cap: data.cap,
        url: data.url,
        nextCap: undefined,
        status: data.status,
        category: 'anime',
        recipientId: data.recipientId,
        hasNewchapter: false,
        image: data.image,
      },
      data?.id,
    );

    await this.documentRepository.createDocument(newDocument);
  }
}
3;
