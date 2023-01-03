import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { BrokerProvider } from '../broker.provider';

@Module({ controllers: [], providers: [BrokerProvider, TaskService] })
export class TaskModule {}
