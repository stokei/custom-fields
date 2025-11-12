import { FieldEntity } from '@/modules/fields/domain/entities/field.entity';
import {
  FieldRepository,
  InjectFieldRepository,
} from '@/modules/fields/domain/repositories/field.repository';
import { FieldTypeValueObject } from '@/modules/fields/domain/value-objects/field-type.vo';
import { DomainEventBusService } from '@/shared/infra/event-bus/domain-event-bus.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateFieldCommand } from './create-field.command';

@CommandHandler(CreateFieldCommand)
export class CreateFieldHandler implements ICommandHandler<CreateFieldCommand> {
  constructor(
    @InjectFieldRepository()
    private readonly repo: FieldRepository,
    private readonly domainEventBusService: DomainEventBusService,
  ) { }

  async execute(c: CreateFieldCommand) {
    // regra de negócio no domínio
    const field = FieldEntity.create({
      tenantId: c.tenantId,
      context: c.context,
      key: c.key,
      label: c.label,
      type: FieldTypeValueObject.create(c.type),
      required: c.required,
      order: c.order,
      placeholder: c.placeholder,
      group: c.group,
      options: c.options ?? [],
      isActive: true,
      version: 1,
    });

    await this.repo.save(field);

    this.domainEventBusService.publishAll(field.domainEvents);

    return { id: field.id };
  }
}
