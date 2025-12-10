import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { FieldDeactivatedEvent } from '@/modules/fields/domain/events/field-deactivated/field-deactivated.event';
import { CommandBase } from '@/shared/application/base/command-base';
import { SagaBase } from '@/shared/application/base/saga-base';

@Injectable()
export class FieldDeactivatedSaga extends SagaBase<FieldDeactivatedEvent> {
  execute(events$: Observable<FieldDeactivatedEvent>): Observable<CommandBase> {
    return this.mapEvents(events$, FieldDeactivatedEvent, () => []);
  }
}
