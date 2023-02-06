import { FindDocumentByName } from '../useCases/find-document-by-name';
import { InMemoryDocumentRepository } from '@test/repositories/in-memory-document-repository';
import { MakeDocument } from '@test/helpers/make-document';

describe('FindDocumentByName', () => {
  it('should be able to find a document by name', async () => {
    const documentRepository = new InMemoryDocumentRepository();

    const service = new FindDocumentByName(documentRepository);

    await documentRepository.createDocument(
      MakeDocument.create({ name: 'Bokemonogatari' }),
    );

    const results = await service.execute({ name: 'Bokemonogatari' });

    expect(results).toBeTruthy();

    expect(results?.document.name).toBe('Bokemonogatari');
  });

  it('should be able to get null if document not exists', async () => {
    const documentRepository = new InMemoryDocumentRepository();

    const service = new FindDocumentByName(documentRepository);

    const results = await service.execute({ name: 'Bokemonogatari' });

    expect(results.document).toBe(null);
  });
});
