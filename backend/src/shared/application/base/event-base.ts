import { IEvent } from '@nestjs/cqrs';

export type EventBase = IEvent;

export abstract class EventHandlerBase<TEvent extends EventBase, TResponse = any> {
  abstract execute(event: TEvent): TResponse;
}
