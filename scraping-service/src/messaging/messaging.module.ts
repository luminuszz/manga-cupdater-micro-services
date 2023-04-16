import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaProvider } from './kafka.provider';
import { MessagingService } from './messaging.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [KafkaProvider, MessagingService],
  exports: [MessagingService, KafkaProvider],
})
export class MessagingModule {}
