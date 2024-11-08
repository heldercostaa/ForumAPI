import { DomainEvents } from '@/core/events/domain-events';
import { IEventHandler } from '@/core/events/event-handler';
import { IQuestionsRepository } from '@/domain/forum/application/repositories/questions';
import { AnswerCreatedEvent } from '@/domain/forum/enterprise/events/answer-created-event';
import { SendNotificationUseCase } from '../use-cases/send-notification';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OnAnswerCreated implements IEventHandler {
  constructor(
    private questionsRepository: IQuestionsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      AnswerCreatedEvent.name,
    );
  }

  private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
    const question = await this.questionsRepository.findById(
      answer.questionId.toString(),
    );

    if (!question) return;

    await this.sendNotification.execute({
      recipientId: question.authorId.toString(),
      title: `Nova resposta em "${question.title
        .substring(0, 40)
        .concat('...')}"`,
      content: answer.excerpt,
    });
  }
}
