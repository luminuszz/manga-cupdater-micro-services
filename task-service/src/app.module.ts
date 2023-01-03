import { Module } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [TaskModule, ScheduleModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
