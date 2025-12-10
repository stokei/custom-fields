import { EventsHandler } from '@nestjs/cqrs';

import { FieldCreatedEvent } from '@/modules/fields/domain/events/field-created/field-created.event';
import { EventHandlerBase } from '@/shared/application/base/event-base';
import { LoggerService } from '@/shared/infra/logger/logger.service';

@EventsHandler(FieldCreatedEvent)
export class FieldCreatedHandler extends EventHandlerBase<FieldCreatedEvent> {
  constructor(private readonly loggerService: LoggerService) {
    super();
  }

  async execute(event: FieldCreatedEvent) {
    this.loggerService.log(FieldCreatedHandler.name, JSON.stringify(event));
    return event;
  }
}
