import { Document, Status } from '@app/entities/document.entitiy';

export abstract class DocumentRepository {
  abstract findDocumentById(id: string): Promise<Document | null>;

  abstract updateDocumentStatus(
    id: string,
    status: Status,
    chapter?: number,
  ): Promise<void>;

  abstract createDocument(document: Document): Promise<void>;

  abstract findAllDocumentWithUnreadStatus(): Promise<Document[]>;

  abstract findDocumentByName(name: string): Promise<Document | null>;
}
