import { DomainEvent } from '@/shared/domain/base/domain-event';
import { convertToISOTimestamp } from '@/utils/dates';
import { FieldEntity } from '../../entities/field.entity';

interface FieldUpdatedEventProps {
  readonly field: FieldEntity;
}

export class FieldUpdatedEvent extends DomainEvent {
  public readonly aggregateId: string;
  public readonly occurredAt: number;
  public readonly eventName: string;
  public readonly field: FieldEntity;

  constructor(props: FieldUpdatedEventProps) {
    super();

    this.eventName = 'field.updated';
    this.occurredAt = convertToISOTimestamp(new Date());
    this.aggregateId = props.field.id;
    this.field = props.field;
  }
}
