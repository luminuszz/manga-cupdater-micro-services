import { Document, Status } from '@app/entities/document.entitiy';

export abstract class DocumentRepository {
  abstract findDocumentById(id: string): Promise<Document | null>;

  abstract updateDocumentStatus(id: string, status: Status): Promise<void>;

  abstract createDocument(document: Document): Promise<void>;

  abstract findAllDocumentWithUnreadStatus(): Promise<Document[]>;
}
