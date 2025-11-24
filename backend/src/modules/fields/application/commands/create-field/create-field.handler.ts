import { FieldEntity } from '@/modules/fields/domain/entities/field.entity';
import {
  FieldRepository,
  InjectFieldRepository,
} from '@/modules/fields/domain/repositories/field.repository';
import { DomainEventBusService } from '@/shared/infra/event-bus/domain-event-bus.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateFieldCommand } from './create-field.command';
import { CreateFieldViewModel } from './create-field.viewmodel';

@CommandHandler(CreateFieldCommand)
export class CreateFieldHandler implements ICommandHandler<CreateFieldCommand> {
  constructor(
    @InjectFieldRepository()
    private readonly fieldRepository: FieldRepository,
    private readonly domainEventBusService: DomainEventBusService,
  ) { }

  async execute(command: CreateFieldCommand) {
    const field = FieldEntity.create(command);
    await this.fieldRepository.save(field);

    field.addFieldCreatedDomainEvent();
    this.domainEventBusService.publishAll(field.domainEvents);

    return CreateFieldViewModel.create({
      id: field.id,
    });
  }
}
