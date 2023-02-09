import { Module } from '@nestjs/common';
import { NotionDocumentRepository } from '@infra/database/notion/repositories/notion-document-repository';
import { NotionClientProvider } from '@infra/database/notion/notion-client.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [NotionClientProvider, NotionDocumentRepository],
  exports: [NotionClientProvider, NotionDocumentRepository],
})
export class NotionModule {}
