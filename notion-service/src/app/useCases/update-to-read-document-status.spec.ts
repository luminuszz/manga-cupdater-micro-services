import { DocumentRepository } from '@app/repositories/document-repository';
import { InMemoryDocumentRepository } from '@test/repositories/in-memory-document-repository';
import { MakeDocument } from '@test/helpers/make-document';
import { UpdateToReadDocumentStatus } from '@app/useCases/update-to-read-document-status';
import { FindDocumentById } from '@app/useCases/find-document-by-id';
import { NotFoundDocumentError } from '@app/useCases/errors/not-found-document-error';

describe('UpdateToReadDocumentStatus', () => {
  let documentRepository: DocumentRepository;

  beforeEach(() => {
    documentRepository = new InMemoryDocumentRepository();
  });

  it('should be able to update a document status to read', async () => {
    const document = MakeDocument.create({ status: 'unread' });
    const findDocument = new FindDocumentById(documentRepository);
    const updateToReadDocumentStatus = new UpdateToReadDocumentStatus(
      documentRepository,
    );

    await documentRepository.createDocument(document);

    await updateToReadDocumentStatus.execute({
      status: 'read',
      id: document.id,
    });

    const updatedDocument = await findDocument.execute(document.id);

    expect(updatedDocument?.status).toBe('read');
  });

  it('should be able to return null if document not found', async () => {
    const fake_id = 'fake_id';

    await documentRepository.createDocument(
      MakeDocument.create({ id: 'other_id' }),
    );

    const updateToReadDocumentStatus = new UpdateToReadDocumentStatus(
      documentRepository,
    );

    await expect(
      updateToReadDocumentStatus.execute({ status: 'read', id: fake_id }),
    ).rejects.toBeInstanceOf(NotFoundDocumentError);
  });
});
