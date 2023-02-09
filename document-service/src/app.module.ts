import { Module } from '@nestjs/common';
import { DocumentController } from '@infra/tcp/document.controller';
import { FindDocumentById } from '@core/useCases/find-document-by-id';
import { ConfigModule } from '@nestjs/config';
import { FindAllDocumentsWithFollowingStatusWithHasNewChapterFalse } from '@core/useCases/find-all-documents-with-following-status-with-hasNewChapterFalse';
import { FindAllDocumentsWithUnfollowStatus } from '@core/useCases/find-all-documents-with-unfollow-status';
import { FindDocumentByName } from '@core/useCases/find-document-by-name';
import { MessagingModule } from '@infra/messaging/messaging.module';
import { DatabaseModule } from '@infra/database/database.module';
import { CreateDocument } from '@core/useCases/create-document';
import { NotionModule } from '@infra/database/notion/notion.module';
import { BatchModule } from '@infra/batchs/batch.module';
import { MarkDocumentToUnread } from '@core/useCases/mark-document-to-unread';
import { MarkDocumentToRead } from '@core/useCases/mark-document-to-read';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MessagingModule,
    DatabaseModule,
    NotionModule,
    BatchModule,
  ],

  providers: [
    FindDocumentById,
    FindAllDocumentsWithFollowingStatusWithHasNewChapterFalse,
    FindDocumentByName,
    CreateDocument,
    FindAllDocumentsWithUnfollowStatus,
    MarkDocumentToRead,
    MarkDocumentToUnread,
  ],

  controllers: [DocumentController],
})
export class AppModule {}
