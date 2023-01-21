export class DocumentAlreadyExistsError extends Error {
  constructor() {
    super('Document already exists');
  }
}
