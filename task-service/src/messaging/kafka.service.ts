import { ClientKafka } from '@nestjs/microservices';
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KafkaService
  extends ClientKafka
  implements OnModuleInit, OnModuleDestroy
{
  public logger = new Logger(KafkaService.name);

  constructor(private readonly config: ConfigService) {
    super({
      client: {
        clientId: 'task-service-client',
        brokers: [config.get<string>('KAFKA_CONECT_URL')],
      },

      consumer: {
        groupId: 'task-service-consumer',
      },
    });
  }

  async onModuleInit() {
    this.subscribeToResponseOf('document.findAllUnread');

    await this.connect();

    this.logger.debug('Kafka is listening');
  }

  async onModuleDestroy() {
    await this.close();
  }
}
