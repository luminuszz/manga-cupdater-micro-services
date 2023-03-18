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
        clientId: 'notion-service-client',
        brokers: [config.get<string>('KAFKA_CONNECT_URL')],
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
          restartOnFailure: async (e) => {
            return true;
          },
        },
      },
    });
  }

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.close();
  }
}
