import { Either, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Notification } from '../../enterprise/entities/notification';
import { INotificationsRepository } from '../repositories/notifications';
import { Injectable } from '@nestjs/common';

export type SendNotificationUseCaseParams = {
  recipientId: string;
  title: string;
  content: string;
};

export type SendNotificationUseCaseReturn = Either<
  null,
  {
    notification: Notification;
  }
>;

@Injectable()
export class SendNotificationUseCase {
  constructor(private notificationsRepository: INotificationsRepository) {}

  async execute({
    recipientId,
    title,
    content,
  }: SendNotificationUseCaseParams): Promise<SendNotificationUseCaseReturn> {
    const notification = Notification.create({
      recipientId: new UniqueEntityID(recipientId),
      title,
      content,
    });

    await this.notificationsRepository.create(notification);

    return right({
      notification,
    });
  }
}
