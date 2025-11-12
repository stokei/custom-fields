import { DomainEvent } from '@/shared/domain/base/domain-event';
import { convertToISOTimestamp } from '@/utils/dates';

export class FieldCreatedEvent extends DomainEvent {
  readonly aggregateId: string;
  readonly occurredAt: number;
  readonly eventName: string;

  constructor(
    public readonly fieldId: string,
    public readonly tenantId: string,
    public readonly context: string,
    public readonly key: string,
  ) {
    super();

    this.eventName = 'field.created';
    this.occurredAt = convertToISOTimestamp(new Date());
    this.aggregateId = fieldId;
  }
}
