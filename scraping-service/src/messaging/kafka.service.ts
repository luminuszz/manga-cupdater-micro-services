import { ClientKafka } from '@nestjs/microservices';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KafkaService
  extends ClientKafka
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly config: ConfigService) {
    super({
      client: {
        clientId: 'scraping-service-client',
        brokers: [config.get<string>('KAFKA_CONECT_URL')],
      },

      consumer: {
        groupId: 'scraping-service-consumer',
      },
    });
  }

  async onModuleInit() {
    this.subscribeToResponseOf('document.findAllUnread');

    await this.connect();
  }

  async onModuleDestroy() {
    await this.close();
  }
}
