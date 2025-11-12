import { Observable } from 'rxjs';
import { CommandBase } from './command-base';
import { EventBase } from './event-base';

export abstract class SagaBase<TEvent extends EventBase> {
  abstract handle(events$: Observable<TEvent>): Observable<CommandBase>;
}
