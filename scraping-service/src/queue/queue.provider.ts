import { SharedBullAsyncConfiguration } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';

export const BullModuleConfig: SharedBullAsyncConfiguration = {
  useFactory: (config: ConfigService<Env>) => ({
    redis: {
      port: config.get('REDIS_PORT' as keyof Env),
      host: config.get('REDIS_HOST' as keyof Env),
      password: config.get('REDIS_PASSWORD' as keyof Env),
    },
    defaultJobOptions: {
      removeOnComplete: true,
    },
  }),
  inject: [ConfigService],
};
