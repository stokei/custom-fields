import { EventsHandler } from '@nestjs/cqrs';

import { FieldDeactivatedEvent } from '@/modules/fields/domain/events/field-deactivated/field-deactivated.event';
import { EventHandlerBase } from '@/shared/application/base/event-base';
import { LoggerService } from '@/shared/infra/logger/logger.service';

@EventsHandler(FieldDeactivatedEvent)
export class FieldDeactivatedHandler extends EventHandlerBase<FieldDeactivatedEvent> {
  constructor(private readonly loggerService: LoggerService) {
    super();
  }

  async execute(event: FieldDeactivatedEvent) {
    this.loggerService.log(FieldDeactivatedHandler.name, JSON.stringify(event));
    return event;
  }
}
