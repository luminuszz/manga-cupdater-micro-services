import { Module } from '@nestjs/common';
import { DocumentController } from '@infra/tcp/document.controller';
import { FindDocumentById } from '@app/useCases/find-document-by-id';
import { ConfigModule } from '@nestjs/config';
import { FindAllDocumentsWithFollowingStatusWithHasNewChapterFalse } from '@app/useCases/find-all-documents-with-following-status-with-hasNewChapterFalse';
import { FindAllDocumentsWithUnfollowStatus } from '@app/useCases/find-all-documents-with-unfollow-status';
import { FindDocumentByName } from '@app/useCases/find-document-by-name';
import { MessagingModule } from '@infra/messaging/messaging.module';
import { DatabaseModule } from '@infra/database/database.module';
import { CreateDocument } from '@app/useCases/create-document';
import { NotionModule } from '@infra/database/notion/notion.module';
import { BatchModule } from '@infra/batchs/batch.module';
import { MarkDocumentToUnread } from '@app/useCases/mark-document-to-unread';
import { MarkDocumentToRead } from '@app/useCases/mark-document-to-read';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
