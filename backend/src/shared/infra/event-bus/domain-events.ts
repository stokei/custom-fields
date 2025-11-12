import { DomainEvent } from '../../domain/base/domain-event';

type DomainEventCallback = (event: DomainEvent) => void;

export class DomainEvents {
  private static handlers: Map<string, DomainEventCallback[]> = new Map();

  static register(eventName: string, callback: DomainEventCallback) {
    if (!this.handlers.has(eventName)) this.handlers.set(eventName, []);
    this.handlers.get(eventName)!.push(callback);
  }

  static dispatch(event: DomainEvent) {
    const handlers = this.handlers.get(event.eventName) ?? [];
    handlers.forEach((cb) => cb(event));
  }
}
