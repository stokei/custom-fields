import { FieldEntity } from '@/modules/fields/domain/entities/field.entity';
import {
  FieldRepository,
  InjectFieldRepository,
} from '@/modules/fields/domain/repositories/field.repository';
import { CommandHandlerBase } from '@/shared/application/base/command-base';
import { Result } from '@/shared/domain/base/result';
import { DomainEventBusService } from '@/shared/infra/event-bus/domain-event-bus.service';
import { CommandHandler } from '@nestjs/cqrs';
import { CreateFieldCommand } from './create-field.command';
import { CreateFieldViewModel } from './create-field.viewmodel';

export type CreateFieldCommandResponse = Result<CreateFieldViewModel>;
@CommandHandler(CreateFieldCommand)
export class CreateFieldHandler extends CommandHandlerBase<
  CreateFieldCommand,
  Promise<CreateFieldCommandResponse>
> {
  constructor(
    @InjectFieldRepository()
    private readonly fieldRepository: FieldRepository,
    private readonly domainEventBusService: DomainEventBusService,
  ) {
    super();
  }

  async execute(command: CreateFieldCommand) {
    try {
      const field = FieldEntity.create(command);
      await this.fieldRepository.save(field);

      field.addFieldCreatedDomainEvent();
      this.domainEventBusService.publishAll(field.domainEvents);

      return Result.ok<CreateFieldViewModel>(
        CreateFieldViewModel.create({
          id: field.id,
        }),
      );
    } catch (error) {
      return Result.fail<CreateFieldViewModel>(error);
    }
  }
}
