import { DomainEvent, EventNameEnum } from '@/shared/domain/base/domain-event';
import { convertToISOTimestamp } from '@/utils/dates';

import { FieldEntity } from '../../entities/field.entity';

interface FieldDeactivatedEventProps {
  readonly field: FieldEntity;
}

export class FieldDeactivatedEvent extends DomainEvent {
  public readonly field: FieldEntity;

  constructor(props: FieldDeactivatedEventProps) {
    super({
      eventName: EventNameEnum.FIELD_DEACTIVATED,
      occurredAt: convertToISOTimestamp(new Date()),
      aggregateId: props.field.id,
    });

    this.field = props.field;
  }
}
