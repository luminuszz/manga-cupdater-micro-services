import { DocumentRepository } from '../repositories/document-repository';
import { FindDocumentById } from './find-document-by-id';
import { MakeDocument } from '@test/helpers/make-document';
import { InMemoryDocumentRepository } from '@test/repositories/in-memory-document-repository';

describe('FindDocumentById', () => {
  let documentRepository: DocumentRepository;

  beforeEach(() => {
    documentRepository = new InMemoryDocumentRepository();
  });

  it('should find a document by id', async () => {
    const id = 'some_id';

    const findDocument = new FindDocumentById(documentRepository);

    const newDocument = MakeDocument.create({ id });

    await documentRepository.createDocument(newDocument);

    const document = await findDocument.execute(id);

    expect(document).toBeTruthy();
    expect(document?.id).toBe(id);
  });
});
