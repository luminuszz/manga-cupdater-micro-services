import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { MessagingModule } from './messaging/messaging.module';
import { QueueModule } from './queue/queue.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MessagingModule,
    QueueModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
