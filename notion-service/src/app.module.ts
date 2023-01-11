import { Module } from '@nestjs/common';
import { NotionController } from '@infra/tcp/Notion.controller';
import { NotionClientProvider } from '@infra/database/notion/notion-client.provider';
import { FindDocumentById } from '@app/useCases/find-document-by-id';
import { DocumentRepository } from '@app/repositories/document-repository';
import { NotionDocumentRepository } from '@infra/database/notion/notion-document-repository';
import { UpdateToReadDocumentStatus } from '@app/useCases/update-to-read-document-status';
import { ConfigModule } from '@nestjs/config';
import { FindAllDocumentsUnread } from '@app/useCases/find-all-documents-unread';
import { FindDocumentByName } from '@app/useCases/find-document-by-name';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [NotionController],
  providers: [
    { provide: DocumentRepository, useClass: NotionDocumentRepository },
    NotionClientProvider,
    FindDocumentById,
    UpdateToReadDocumentStatus,
    FindAllDocumentsUnread,
    FindDocumentByName,
  ],
})
export class AppModule {}
