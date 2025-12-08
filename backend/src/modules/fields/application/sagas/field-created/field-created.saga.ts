import { FieldCreatedEvent } from '@/modules/fields/domain/events/field-created/field-created.event';
import { CommandBase } from '@/shared/application/base/command-base';
import { SagaBase } from '@/shared/application/base/saga-base';
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class FieldCreatedSaga extends SagaBase<FieldCreatedEvent> {
  execute(events$: Observable<FieldCreatedEvent>): Observable<CommandBase> {
    return this.mapEvents(events$, FieldCreatedEvent, () => []);
  }
}
