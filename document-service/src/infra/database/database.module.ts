import { Module } from '@nestjs/common';
import { DocumentRepository } from '@app/repositories/document-repository';

import { NotionModule } from '@infra/database/notion/notion.module';
import { PrismaDocumentRepository } from '@infra/database/prisma/repositories/prisma-document.repository';
import { PrismaModule } from '@infra/database/prisma/prisma.module';

@Module({
  imports: [NotionModule, PrismaModule],

  providers: [
    {
      provide: DocumentRepository,
      useClass: PrismaDocumentRepository,
    },
  ],

  exports: [DocumentRepository],
})
export class DatabaseModule {}
