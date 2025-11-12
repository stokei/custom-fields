export abstract class DomainEvent {
  abstract readonly aggregateId: string;
  abstract readonly occurredAt: number;
  abstract readonly eventName: string;
}
