import { DomainEvent, EventNameEnum } from '@/shared/domain/base/domain-event';
import { convertToISOTimestamp } from '@/utils/dates';

import { FieldEntity } from '../../entities/field.entity';

interface FieldUpdatedEventProps {
  readonly field: FieldEntity;
}

export class FieldUpdatedEvent extends DomainEvent {
  public readonly field: FieldEntity;

  constructor(props: FieldUpdatedEventProps) {
    super({
      eventName: EventNameEnum.FIELD_UPDATED,
      occurredAt: convertToISOTimestamp(new Date()),
      aggregateId: props.field.id,
    });

    this.field = props.field;
  }
}
