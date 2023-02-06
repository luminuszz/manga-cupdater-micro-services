import { MakeDocument } from '@test/helpers/make-document';
import { InMemoryDocumentRepository } from '@test/repositories/in-memory-document-repository';
import { FindAllDocumentsWithFollowingStatusWithHasNewChapterFalse } from '../useCases/find-all-documents-with-following-status-with-hasNewChapterFalse';

describe('FindAllDocumentsWithFollowingStatus', () => {
  it('should be able to find all document with status following ', async () => {
    const documentRepository = new InMemoryDocumentRepository();

    const findAllDocumentsUnread =
      new FindAllDocumentsWithFollowingStatusWithHasNewChapterFalse(
        documentRepository,
      );

    const docummentsWithUnreadStatusMock = Array.from({ length: 4 }).map(() =>
      MakeDocument.create({ status: 'following' }),
    );

    docummentsWithUnreadStatusMock.forEach((item) => {
      documentRepository.createDocument(item);
    });

    const result = await findAllDocumentsUnread.execute();

    expect(result).toHaveLength(4);
    expect(result.every((item) => item.status === 'following')).toBeTruthy();
  });

  it('should be able to find all document with status following and hasNewChapter false ', async () => {
    const documentRepository = new InMemoryDocumentRepository();

    const findAllDocumentsUnread =
      new FindAllDocumentsWithFollowingStatusWithHasNewChapterFalse(
        documentRepository,
      );

    const docummentsWithUnreadStatusMock = Array.from({ length: 4 }).map(() =>
      MakeDocument.create({ status: 'following' }),
    );

    docummentsWithUnreadStatusMock.forEach((item) => {
      documentRepository.createDocument(item);
    });

    await documentRepository.createDocument(
      MakeDocument.create({ status: 'following', hasNewchapter: true }),
    );

    const result = await findAllDocumentsUnread.execute();

    expect(result).toHaveLength(4);
    expect(
      result.every(
        (item) => item.status === 'following' && !item.hasNewchapter,
      ),
    ).toBeTruthy();
  });

  it('should ble able to return empty array if not found documents with status unread', async () => {
    const documentRepository = new InMemoryDocumentRepository();

    const findAllDocumentsUnread =
      new FindAllDocumentsWithFollowingStatusWithHasNewChapterFalse(
        documentRepository,
      );

    const docummentsWithUnreadStatusMock = Array.from({ length: 4 }).map(() =>
      MakeDocument.create({ status: 'on_hold' }),
    );

    docummentsWithUnreadStatusMock.forEach((item) => {
      documentRepository.createDocument(item);
    });

    const result = await findAllDocumentsUnread.execute();

    expect(result).toHaveLength(0);
  });
});
