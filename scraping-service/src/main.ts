import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

(async () => {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'scraping-service',

          brokers: [process.env.KAFKA_CONNECT_URL],
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

        consumer: {
          groupId: 'scraping-service-consumer',
        },
      },
    },
  );
  await app.listen();
})();
