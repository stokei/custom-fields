import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { DomainEvent } from '../../domain/base/domain-event';

@Injectable()
export class DomainEventBusService {
  constructor(private readonly eventBus: EventBus) { }

  publish(event: DomainEvent) {
    this.eventBus.publish(event);
  }
  publishAll(events: DomainEvent[]) {
    this.eventBus.publishAll(events);
  }
}
