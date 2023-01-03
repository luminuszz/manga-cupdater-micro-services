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
          clientId: 'task-service-client',
          brokers: ['broker:29092'],
        },

        consumer: {
          groupId: 'task-service-consumer',
        },
      },
    });
  },
};
