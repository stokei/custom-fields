import { EventsHandler } from '@nestjs/cqrs';

import { FieldActivatedEvent } from '@/modules/fields/domain/events/field-activated/field-activated.event';
import { EventHandlerBase } from '@/shared/application/base/event-base';
import { LoggerService } from '@/shared/infra/logger/logger.service';

@EventsHandler(FieldActivatedEvent)
export class FieldActivatedHandler extends EventHandlerBase<FieldActivatedEvent> {
  constructor(private readonly loggerService: LoggerService) {
    super();
  }

  async execute(event: FieldActivatedEvent) {
    this.loggerService.log(FieldActivatedHandler.name, JSON.stringify(event));
    return event;
  }
}
