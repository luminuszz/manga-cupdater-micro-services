import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { MessagingModule } from '../messaging/messaging.module';

@Module({
  imports: [MessagingModule],
  controllers: [ApiController],
})
export class ApiModule {}
