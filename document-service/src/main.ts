import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

(async () => {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        consumer: {
          groupId: 'manga-chapter-service-consumer',
        },

        producer: {
          retry: {
            retries: 5,
            maxRetryTime: 5000,
            multiplier: 2,
          },
        },

        client: {
          brokers: [process.env.KAFKA_CONNECT_URL],
          clientId: 'manga-chapter-service',

          retry: {
            retries: 5,
            maxRetryTime: 5000,
            multiplier: 2,
          },

          ssl: true,
          sasl: {
            username: process.env.KAFKA_USERNAME,
            password: process.env.KAFKA_PASSWORD,
            mechanism: 'plain',
          },
          reauthenticationThreshold: 45000,
        },
      },
    },
  );

  app.useGlobalPipes(new ValidationPipe());

  await app.listen();
})();
