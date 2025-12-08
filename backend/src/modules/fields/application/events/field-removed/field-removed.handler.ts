import { FieldRemovedEvent } from '@/modules/fields/domain/events/field-removed/field-removed.event';
import { EventHandlerBase } from '@/shared/application/base/event-base';
import { LoggerService } from '@/shared/infra/logger/logger.service';
import { EventsHandler } from '@nestjs/cqrs';

@EventsHandler(FieldRemovedEvent)
export class FieldRemovedHandler extends EventHandlerBase<FieldRemovedEvent> {
  constructor(private readonly loggerService: LoggerService) {
    super();
  }

  async execute(event: FieldRemovedEvent) {
    this.loggerService.log(FieldRemovedHandler.name, JSON.stringify(event));
    return event;
  }
}
