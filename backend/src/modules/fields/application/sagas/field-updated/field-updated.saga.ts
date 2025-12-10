import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { FieldUpdatedEvent } from '@/modules/fields/domain/events/field-updated/field-updated.event';
import { CommandBase } from '@/shared/application/base/command-base';
import { SagaBase } from '@/shared/application/base/saga-base';

@Injectable()
export class FieldUpdatedSaga extends SagaBase<FieldUpdatedEvent> {
  execute(events$: Observable<FieldUpdatedEvent>): Observable<CommandBase> {
    return this.mapEvents(events$, FieldUpdatedEvent, () => []);
  }
}
