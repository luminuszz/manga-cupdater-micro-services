import { InMemoryDocumentRepository } from '@test/repositories/in-memory-document-repository';
import { CreateDocument } from '../useCases/create-document';
import { MakeDocument } from '@test/helpers/make-document';
import { DocumentAlreadyExistsError } from '../useCases/errors/document-already-exists.error';

describe('CreateDocument', () => {
  it('shoulde ble to create a new Document', async () => {
    const documentRepository = new InMemoryDocumentRepository();

    const service = new CreateDocument(documentRepository);

    const newDocument = MakeDocument.create({
      id: 'some_id',
      name: 'boku no hero',
    });

    await service.execute({
      url: newDocument.url,
      status: newDocument.status,
      cap: newDocument.cap,
      name: newDocument.name,
      createdAt: newDocument.createdAt,
      recipientId: newDocument.recipientId,
      id: newDocument.id,
    });

    const document = await documentRepository.findDocumentById(newDocument.id);

    expect(document).toHaveProperty('createdAt');
    expect(document).toHaveProperty('name');
    expect(document).toHaveProperty('cap');
    expect(document).toHaveProperty('url');
    expect(document.name).toBe('boku no hero');
  });

  it('shoulde not ble to create a new Document if recipient id already exists', async () => {
    const documentRepository = new InMemoryDocumentRepository();

    const service = new CreateDocument(documentRepository);

    const fakeRecipentId = 'fake_recipient_id';

    const newDocument = MakeDocument.create({
      name: 'boku no hero',
      recipientId: fakeRecipentId,
    });

    await service.execute(newDocument);

    await expect(service.execute(newDocument)).rejects.toBeInstanceOf(
      DocumentAlreadyExistsError,
    );
  });

  it('shoulde not ble to create a new Document if name  already exists', async () => {
    const documentRepository = new InMemoryDocumentRepository();

    const service = new CreateDocument(documentRepository);

    const name = 'Kimetsu no aiba';

    const newDocument = MakeDocument.create({
      name,
    });

    const newDocument2 = MakeDocument.create({
      name,
    });

    await service.execute(newDocument);

    await expect(service.execute(newDocument2)).rejects.toBeInstanceOf(
      DocumentAlreadyExistsError,
    );
  });
});
