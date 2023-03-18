import { SendNotification } from '@app/useCases/send-notification';
import { NotificationProviderModule } from '@infra/adapters/notification/notification-provider.module';
import { DatabaseModule } from '@infra/database/database.module';
import { NotificationController } from '@infra/tcp/notification.controller';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    NotificationProviderModule,
  ],
  controllers: [NotificationController],
  providers: [SendNotification],
})
export class AppModule {}
