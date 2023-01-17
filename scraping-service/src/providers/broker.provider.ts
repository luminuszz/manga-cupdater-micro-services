import { Provider } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

export const BROKER_PROVIDER = 'BROKER_PROVIDER';
export const BrokerProvider: Provider = {
  provide: BROKER_PROVIDER,
  useFactory: (config: ConfigService) => {
    return ClientProxyFactory.create({
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'scraping-service-client',
          brokers: [config.get<string>('KAFKA_CONECT_URL')],
        },

        consumer: {
          groupId: 'scraping-service-consumer',
        },
      },
    });
  },
  inject: [ConfigService],
};
