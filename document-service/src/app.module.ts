import { Module } from '@nestjs/common';
import { DocumentController } from '@infra/tcp/document.controller';
import { FindDocumentById } from '@app/useCases/find-document-by-id';
import { UpdateToReadDocumentStatus } from '@app/useCases/update-to-read-document-status';
import { ConfigModule } from '@nestjs/config';
import { FindAllDocumentsUnread } from '@app/useCases/find-all-documents-unread';
import { FindDocumentByName } from '@app/useCases/find-document-by-name';
import { MessagingModule } from '@infra/messaging/messaging.module';
import { DatabaseModule } from '@infra/database/database.module';
import { CreateDocument } from '@app/useCases/create-document';
import { NotionModule } from '@infra/database/notion/notion.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MessagingModule,
    DatabaseModule,
    NotionModule,
  ],

  providers: [
    FindDocumentById,
    UpdateToReadDocumentStatus,
    FindAllDocumentsUnread,
    FindDocumentByName,
    CreateDocument,
  ],

  controllers: [DocumentController],
})
export class AppModule {}
