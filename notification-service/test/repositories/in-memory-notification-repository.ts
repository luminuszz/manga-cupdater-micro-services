import { NotificationRepository } from '@app/repositories/notification-repository';
import { Notification } from '@app/entities/notification';

export class InMemoryNotificationRepository implements NotificationRepository {
  private readonly notifications: Notification[] = [];

  async create(notification: Notification): Promise<void> {
    this.notifications.push(notification);
  }
}
