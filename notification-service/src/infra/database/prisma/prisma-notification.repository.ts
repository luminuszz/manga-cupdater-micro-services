import { NotificationRepository } from '@app/repositories/notification-repository';
import { Notification } from '@app/entities/notification';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infra/database/prisma/prisma.service';

@Injectable()
export class PrismaNotificationRepository implements NotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(notification: Notification): Promise<void> {
    await this.prisma.notification.create({
      data: {
        id: notification.id,
        read_at: notification.read_at,
        content: notification.content,
        recipient_id: notification.recipient_id,
        type: 'Manga',
      },
    });
  }
}
