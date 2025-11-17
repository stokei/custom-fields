import { DomainEvent } from '@/shared/domain/base/domain-event';
import { convertToISOTimestamp } from '@/utils/dates';
import { FieldEntity } from '../../entities/field.entity';

interface FieldCreatedEventProps {
  readonly field: FieldEntity;
}

export class FieldCreatedEvent extends DomainEvent {
  public readonly aggregateId: string;
  public readonly occurredAt: number;
  public readonly eventName: string;
  public readonly field: FieldEntity;

  constructor(props: FieldCreatedEventProps) {
    super();

    this.eventName = 'field.created';
    this.occurredAt = convertToISOTimestamp(new Date());
    this.aggregateId = props.field.id;
    this.field = props.field;
  }
}
