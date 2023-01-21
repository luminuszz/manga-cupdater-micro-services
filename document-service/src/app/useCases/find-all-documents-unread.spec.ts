import { MakeDocument } from '@test/helpers/make-document';
import { InMemoryDocumentRepository } from '@test/repositories/in-memory-document-repository';
import { FindAllDocumentsUnread } from '@app/useCases/find-all-documents-unread';

describe('FindAllDocumentsUnread', () => {
  it('should be able to find all document with status unread', async () => {
    const documentRepository = new InMemoryDocumentRepository();

    const findAllDocumentsUnread = new FindAllDocumentsUnread(
      documentRepository,
    );

    const docummentsWithUnreadStatusMock = Array.from({ length: 4 }).map(() =>
      MakeDocument.create({ status: 'unread' }),
    );

    docummentsWithUnreadStatusMock.forEach((item) => {
      documentRepository.createDocument(item);
    });

    const result = await findAllDocumentsUnread.execute();

    expect(result).toHaveLength(4);
    expect(result.every((item) => item.status === 'unread')).toBeTruthy();
  });

  it('should ble able to return empty array if not found documents with status unread', async () => {
    const documentRepository = new InMemoryDocumentRepository();

    const findAllDocumentsUnread = new FindAllDocumentsUnread(
      documentRepository,
    );

    const docummentsWithUnreadStatusMock = Array.from({ length: 4 }).map(() =>
      MakeDocument.create({ status: 'read' }),
    );

    docummentsWithUnreadStatusMock.forEach((item) => {
      documentRepository.createDocument(item);
    });

    const result = await findAllDocumentsUnread.execute();

    expect(result).toHaveLength(0);
  });
});
