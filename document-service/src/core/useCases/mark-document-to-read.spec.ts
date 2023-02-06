import { DocumentRepository } from '../repositories/document-repository';
import { InMemoryDocumentRepository } from '@test/repositories/in-memory-document-repository';
import { MarkDocumentToRead } from '../useCases/mark-document-to-read';
import { MakeDocument } from '@test/helpers/make-document';
import { NotFoundDocumentError } from '../useCases/errors/not-found-document-error';

describe('MarkNewChapterRead', () => {
  let documentRepository: DocumentRepository;

  beforeEach(() => {
    documentRepository = new InMemoryDocumentRepository();
  });

  it('should be to update document to Read', async () => {
    const id = '1';

    await documentRepository.createDocument(
      MakeDocument.create({
        id,
        hasNewchapter: true,
        name: 'Vinland Saga',
      }),
    );

    const service = new MarkDocumentToRead(documentRepository);

    await service.execute({ id, chapter: 10 });

    const documents = await documentRepository.findaAllDocuments();

    const document = documents.find((item) => item.id === id);

    expect(document).toBeTruthy();

    expect(document?.hasNewchapter).toBeFalsy();
    expect(document?.hasNewchapter).toBe(false);
    expect(document?.cap).toBe(10);
  });

  it('should not be to update document to read if document not exits', async () => {
    const id = '1';

    await documentRepository.createDocument(
      MakeDocument.create({
        id,
        hasNewchapter: true,
        name: 'Vinland Saga',
        cap: 1,
      }),
    );

    const service = new MarkDocumentToRead(documentRepository);

    await expect(
      service.execute({ id: 'not_exists_id', chapter: 10 }),
    ).rejects.toBeInstanceOf(NotFoundDocumentError);
  });
});
