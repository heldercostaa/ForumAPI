import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Notification } from '../../enterprise/entities/notification';
import { INotificationsRepository } from '../repositories/notifications';

type ReadNotificationUseCaseParams = {
  recipientId: string;
  notificationId: string;
};

type ReadNotificationUseCaseReturn = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    notification: Notification;
  }
>;

export class ReadNotificationUseCase {
  constructor(private notificationsRepository: INotificationsRepository) {}

  async execute({
    recipientId,
    notificationId,
  }: ReadNotificationUseCaseParams): Promise<ReadNotificationUseCaseReturn> {
    const notification =
      await this.notificationsRepository.findById(notificationId);

    if (!notification) {
      return left(new ResourceNotFoundError());
    }

    if (recipientId !== notification.recipientId.toString()) {
      return left(new NotAllowedError());
    }

    notification.read();

    await this.notificationsRepository.create(notification);

    return right({
      notification,
    });
  }
}
