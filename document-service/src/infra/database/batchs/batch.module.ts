import { Module } from '@nestjs/common';
import { SyncPrismaToNotionBatch } from '@infra/database/batchs/syncPrismaToNotion.batch';
import { SyncNotionDatabaseBatch } from '@infra/database/batchs/syncNotionDatabase.batch';
import { NotionModule } from '@infra/database/notion/notion.module';
import { PrismaModule } from '@infra/database/prisma/prisma.module';

@Module({
  imports: [NotionModule, PrismaModule],
  providers: [SyncPrismaToNotionBatch, SyncNotionDatabaseBatch],
  exports: [SyncPrismaToNotionBatch, SyncNotionDatabaseBatch],
})
export class BatchModule {}
