import { FieldUpdatedEvent } from '@/modules/fields/domain/events/field-updated/field-updated.event';
import { EventHandlerBase } from '@/shared/application/base/event-base';
import { LoggerService } from '@/shared/infra/logger/logger.service';
import { EventsHandler } from '@nestjs/cqrs';

@EventsHandler(FieldUpdatedEvent)
export class FieldUpdatedHandler extends EventHandlerBase<FieldUpdatedEvent> {
  constructor(private readonly loggerService: LoggerService) {
    super();
  }

  async execute(event: FieldUpdatedEvent) {
    this.loggerService.log(FieldUpdatedHandler.name, JSON.stringify(event));
    return event;
  }
}
