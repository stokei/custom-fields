import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { FieldActivatedEvent } from '@/modules/fields/domain/events/field-activated/field-activated.event';
import { CommandBase } from '@/shared/application/base/command-base';
import { SagaBase } from '@/shared/application/base/saga-base';

@Injectable()
export class FieldActivatedSaga extends SagaBase<FieldActivatedEvent> {
  execute(events$: Observable<FieldActivatedEvent>): Observable<CommandBase> {
    return this.mapEvents(events$, FieldActivatedEvent, () => []);
  }
}
