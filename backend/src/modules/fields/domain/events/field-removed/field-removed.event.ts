import { DomainEvent } from '@/shared/domain/base/domain-event';
import { convertToISOTimestamp } from '@/utils/dates';

import { FieldEntity } from '../../entities/field.entity';

interface FieldRemovedEventProps {
  readonly field: FieldEntity;
}

export class FieldRemovedEvent extends DomainEvent {
  public readonly aggregateId: string;
  public readonly occurredAt: number;
  public readonly eventName: string;
  public readonly field: FieldEntity;

  constructor(props: FieldRemovedEventProps) {
    super();

    this.eventName = 'field.removed';
    this.occurredAt = convertToISOTimestamp(new Date());
    this.aggregateId = props.field.id;
    this.field = props.field;
  }
}
