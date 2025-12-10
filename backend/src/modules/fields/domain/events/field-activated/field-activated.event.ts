import { DomainEvent, EventNameEnum } from '@/shared/domain/base/domain-event';
import { convertToISOTimestamp } from '@/utils/dates';

import { FieldEntity } from '../../entities/field.entity';

interface FieldActivatedEventProps {
  readonly field: FieldEntity;
}

export class FieldActivatedEvent extends DomainEvent {
  public readonly field: FieldEntity;

  constructor(props: FieldActivatedEventProps) {
    super({
      eventName: EventNameEnum.FIELD_ACTIVATED,
      occurredAt: convertToISOTimestamp(new Date()),
      aggregateId: props.field.id,
    });

    this.field = props.field;
  }
}
