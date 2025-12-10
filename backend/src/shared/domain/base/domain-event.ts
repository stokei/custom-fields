export enum EventNameEnum {
  FIELD_CREATED = 'field.created',
  FIELD_UPDATED = 'field.updated',
  FIELD_DEACTIVATED = 'field.deactivated',
  FIELD_ACTIVATED = 'field.activated',
}

interface DomainEventParams {
  readonly aggregateId: string;
  readonly occurredAt: number;
  readonly eventName: EventNameEnum;
}

export abstract class DomainEvent {
  public readonly aggregateId: string;
  public readonly occurredAt: number;
  public readonly eventName: EventNameEnum;
  constructor(params: DomainEventParams) {
    this.aggregateId = params.aggregateId;
    this.occurredAt = params.occurredAt;
    this.eventName = params.eventName;
  }
}
