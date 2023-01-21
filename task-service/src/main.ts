import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

(async () => {
  const logger = new Logger('Apllication context');

  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'task-service-client',
        retry: {
          retries: 2,
        },

        brokers: [process.env.KAFKA_CONECT_URL],
      },

      consumer: {
        groupId: 'task-service-consumer',
      },
    },
  });

  app.startAllMicroservices().then(() => logger.log('Microservices started'));
  app.listen(3001).then(() => logger.log('http is listening'));
})();
