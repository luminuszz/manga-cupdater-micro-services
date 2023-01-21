import { Module } from '@nestjs/common';
import { SyncPrismaToNotionBatch } from '@infra/database/batchs/syncPrismaToNotion.batch';
import { NotionModule } from '@infra/database/notion/notion.module';
import { PrismaModule } from '@infra/database/prisma/prisma.module';

@Module({
  imports: [NotionModule, PrismaModule],
  providers: [SyncPrismaToNotionBatch],
  exports: [SyncPrismaToNotionBatch],
})
export class BatchModule {}
