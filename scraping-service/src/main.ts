import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

(async () => {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'scraping-service',
          retry: {
            retries: 2,
          },

          brokers: ['broker:29092'],
        },

        consumer: {
          groupId: 'scraping-service-consumer',
        },
      },
    },
  );
  await app.listen();
})();
