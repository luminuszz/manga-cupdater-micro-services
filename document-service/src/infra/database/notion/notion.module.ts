import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotionDocumentRepository } from '@infra/database/notion/repositories/notion-document-repository';
import { NotionClientProvider } from '@infra/database/notion/notion-client.provider';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [NotionClientProvider, NotionDocumentRepository],
  exports: [NotionClientProvider, NotionDocumentRepository],
})
export class NotionModule {}
