import { Module } from '@nestjs/common';
import { DocumentRepository } from '@app/repositories/document-repository';

import { NotionModule } from '@infra/database/notion/notion.module';
import { PrismaDocumentRepository } from '@infra/database/prisma/repositories/prisma-document.repository';
import { PrismaModule } from '@infra/database/prisma/prisma.module';
import { BatchModule } from '@infra/database/batchs/batch.module';
import { SyncPrismaToNotionBatch } from '@infra/database/batchs/syncPrismaToNotion.batch';

@Module({
  imports: [NotionModule, PrismaModule, BatchModule],

  providers: [
    {
      provide: DocumentRepository,
      useClass: PrismaDocumentRepository,
    },
    {
      provide: SyncPrismaToNotionBatch,
      useClass: SyncPrismaToNotionBatch,
    },
  ],

  exports: [DocumentRepository, SyncPrismaToNotionBatch],
})
export class DatabaseModule {}
