import { Injectable } from '@nestjs/common';
import { DocumentRepository } from '@core/repositories/document.repository';

import { Document } from '../entities/document.entitiy';

type Input = {
  name: string;
};

type Output = {
  document: Document | null;
};

@Injectable()
export class FindDocumentByName {
  constructor(private readonly documentRepository: DocumentRepository) {}

  async execute({ name }: Input): Promise<Output> {
    const document = await this.documentRepository.findDocumentByName(name);

    return {
      document,
    };
  }
}
