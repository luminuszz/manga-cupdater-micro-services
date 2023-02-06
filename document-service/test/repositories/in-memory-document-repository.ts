import { Document } from '../../src/core/entities/document.entitiy';
import { DocumentRepository } from '../../src/core/repositories/document-repository';

export class InMemoryDocumentRepository implements DocumentRepository {
  private documents: Document[] = [];

  async updateForNewChapter(id: string): Promise<void> {
    const index = this.documents.findIndex((doc) => doc.id === id);

    const updateDocument = Object.assign(this.documents[index], {});

    updateDocument.hasNewchapter = true;

    this.documents[index] = updateDocument;
  }

  async findDocumentById(id: string): Promise<Document | null> {
    console.log({ documents: this.documents[0] });

    return this.documents.find((document) => document.id === id) || null;
  }

  async createDocument(document: Document): Promise<void> {
    this.documents.push(document);
  }

  async updateHasNewChapterForFalse(id: string): Promise<void> {
    const index = this.documents.findIndex((doc) => doc.id === id);

    const updateDocument = Object.assign(this.documents[index], {});

    updateDocument.hasNewchapter = false;

    this.documents[index] = updateDocument;
  }

  async updateHasNewChapterForTrue(id: string): Promise<void> {
    const index = this.documents.findIndex((doc) => doc.id === id);

    const updateDocument = Object.assign(this.documents[index], {});

    updateDocument.hasNewchapter = true;

    this.documents[index] = updateDocument;
  }

  async findAllDocumentWithStatusFollowingWithHasNewChapterFalse(): Promise<
    Document[]
  > {
    return this.documents.filter(
      (item) => item.status === 'following' && !item.hasNewchapter,
    );
  }

  async findDocumentByName(name: string): Promise<Document | null> {
    const document = this.documents.find((item) => item.name === name);

    return document || null;
  }

  async findDocumentByRecipentId(
    recipientId: string,
  ): Promise<Document | null> {
    return (
      this.documents.find((item) => item.recipientId === recipientId) || null
    );
  }

  async findaAllDocuments(): Promise<Document[]> {
    return this.documents;
  }

  async findAllDocumentWithStatusFollowing(): Promise<Document[]> {
    return this.documents.filter((item) => item.status === 'following');
  }

  async updateChapter(id: string, chapter: number): Promise<void> {
    const index = this.documents.findIndex((doc) => doc.id === id);

    const updateDocument = Object.assign(this.documents[index], {});

    updateDocument.cap = chapter;

    this.documents[index] = updateDocument;
  }
}
