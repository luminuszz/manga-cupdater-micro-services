import { Provider } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

export const BROKER_PROVIDER = 'BROKER_PROVIDER';
export const BrokerProvider: Provider = {
  provide: BROKER_PROVIDER,
  useFactory: () => {
    return ClientProxyFactory.create({
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'notification-service-client',
          brokers: ['139.144.184.180:9092'],
        },

        consumer: {
          groupId: 'notification-service-consumer',
        },
      },
    });
  },
};
