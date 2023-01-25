import { Document } from '@app/entities/document.entitiy';

export abstract class DocumentRepository {
  abstract findDocumentById(id: string): Promise<Document | null>;

  abstract createDocument(document: Document): Promise<void>;

  abstract findAllDocumentWithStatusFollowingWithHasNewChapterFalse(): Promise<
    Document[]
  >;

  abstract findDocumentByName(name: string): Promise<Document | null>;

  abstract findDocumentByRecipentId(
    recipientId: string,
  ): Promise<Document | null>;

  abstract findaAllDocuments(): Promise<Document[]>;

  abstract findAllDocumentWithStatusFollowing(): Promise<Document[]>;

  abstract updateHasNewChapterForFalse(id: string): Promise<void>;

  abstract updateHasNewChapterForTrue(id: string): Promise<void>;

  abstract updateChapter(id: string, chapter: number): Promise<void>;
}
