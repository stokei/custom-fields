import { FieldRemovedEvent } from '@/modules/fields/domain/events/field-removed/field-removed.event';
import { CommandBase } from '@/shared/application/base/command-base';
import { SagaBase } from '@/shared/application/base/saga-base';
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class FieldRemovedSaga extends SagaBase<FieldRemovedEvent> {
  execute(events$: Observable<FieldRemovedEvent>): Observable<CommandBase> {
    return this.mapEvents(events$, FieldRemovedEvent, () => []);
  }
}
