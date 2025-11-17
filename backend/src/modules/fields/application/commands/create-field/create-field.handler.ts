import { FieldEntity } from '@/modules/fields/domain/entities/field.entity';
import {
  FieldRepository,
  InjectFieldRepository,
} from '@/modules/fields/domain/repositories/field.repository';
import { DomainEventBusService } from '@/shared/infra/event-bus/domain-event-bus.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateFieldCommand } from './create-field.command';
import { FieldMapper } from '../../mappers/field.mapper';

@CommandHandler(CreateFieldCommand)
export class CreateFieldHandler implements ICommandHandler<CreateFieldCommand> {
  constructor(
    @InjectFieldRepository()
    private readonly repo: FieldRepository,
    private readonly domainEventBusService: DomainEventBusService,
  ) { }

  async execute(command: CreateFieldCommand) {
    const field = FieldEntity.create(command);
    await this.repo.create(field);

    field.addFieldCreatedDomainEvent();
    this.domainEventBusService.publishAll(field.domainEvents);

    return FieldMapper.toReadModel(field);
  }
}
