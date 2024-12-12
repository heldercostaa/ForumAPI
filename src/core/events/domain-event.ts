import { UniqueEntityID } from '../entities/unique-entity-id';

export interface IDomainEvent {
  occurredAt: Date;
  getAggregateId(): UniqueEntityID;
}
