import { Module } from '@nestjs/common';
import { NotionController } from '@infra/tcp/Notion.controller';
import { FindDocumentById } from '@app/useCases/find-document-by-id';
import { UpdateToReadDocumentStatus } from '@app/useCases/update-to-read-document-status';
import { ConfigModule } from '@nestjs/config';
import { FindAllDocumentsUnread } from '@app/useCases/find-all-documents-unread';
import { FindDocumentByName } from '@app/useCases/find-document-by-name';
import { MessagingModule } from '@infra/messaging/messaging.module';
import { DatabaseModule } from '@infra/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MessagingModule,
    DatabaseModule,
  ],

  providers: [
    FindDocumentById,
    UpdateToReadDocumentStatus,
    FindAllDocumentsUnread,
    FindDocumentByName,
  ],

  controllers: [NotionController],
})
export class AppModule {}
