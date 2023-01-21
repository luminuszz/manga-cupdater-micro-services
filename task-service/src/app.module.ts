import { Module } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MessagingModule } from './messaging/messaging.module';

@Module({
  imports: [ScheduleModule.forRoot(), TaskModule, MessagingModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
