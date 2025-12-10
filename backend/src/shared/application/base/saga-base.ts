import { ofType } from '@nestjs/cqrs';
import { delay, mergeMap, Observable } from 'rxjs';

import { CommandBase } from './command-base';
import { EventBase } from './event-base';

type EventClass<TEvent extends EventBase> = new (...args: any[]) => TEvent;
export abstract class SagaBase<TEvent extends EventBase> {
  abstract execute(events$: Observable<TEvent>): Observable<CommandBase>;

  protected mapEvents(
    events$: Observable<TEvent>,
    eventName: EventClass<TEvent>,
    executeCommands: (currentEvent: TEvent) => CommandBase[],
  ): Observable<CommandBase> {
    return events$.pipe(
      ofType(eventName),
      delay(500),
      mergeMap((event) => executeCommands(event)),
    );
  }
}
