export class NotFoundDocumentError extends Error {
  constructor() {
    super('Document not found');
  }
}
