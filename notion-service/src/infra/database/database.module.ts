import { Module } from '@nestjs/common';
import { DocumentRepository } from '@app/repositories/document-repository';

import { NotionModule } from '@infra/database/notion/notion.module';
import { NotionDocumentRepository } from '@infra/database/notion/repositories/notion-document-repository';

@Module({
  imports: [NotionModule],

  providers: [
    {
      provide: DocumentRepository,
      useClass: NotionDocumentRepository,
    },
  ],

  exports: [DocumentRepository],
})
export class DatabaseModule {}
