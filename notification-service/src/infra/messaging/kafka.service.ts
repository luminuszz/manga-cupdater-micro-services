import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaService
  extends ClientKafka
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly config: ConfigService) {
    super({
      client: {
        clientId: 'notification-service-client',
        brokers: [config.get<string>('KAFKA_CONNECT_URL')],
        connectionTimeout: 5000,
        ssl: true,
        sasl: {
          username: config.get<string>('KAFKA_USERNAME'),
          password: config.get<string>('KAFKA_PASSWORD'),
          mechanism: 'plain',
        },
        retry: {
          retries: 5,
          multiplier: 2,
          maxRetryTime: 10000,
        },
      },
      consumer: {
        groupId: 'notification-service-consumer',
      },
    });
  }

  async onModuleInit() {
    this.subscribeToResponseOf('document.findByName');
    await this.connect();
  }

  async onModuleDestroy() {
    await this.close();
  }
}
