import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { IDomainEvent } from '@/core/events/domain-event';
import { Answer } from '../entities/answer';

export class AnswerCreatedEvent implements IDomainEvent {
  public occurredAt: Date;
  public answer: Answer;

  constructor(answer: Answer) {
    this.answer = answer;
    this.occurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.answer.id;
  }
}
