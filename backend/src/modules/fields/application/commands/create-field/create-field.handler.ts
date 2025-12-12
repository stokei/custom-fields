import { CommandHandler } from '@nestjs/cqrs';

import { FieldEntity } from '@/modules/fields/domain/entities/field.entity';
import { FieldAlreadyExistsException } from '@/modules/fields/domain/errors/field-already-exists-exception';
import {
  FieldRepository,
  InjectFieldRepository,
} from '@/modules/fields/domain/repositories/field.repository';
import { CommandHandlerBase } from '@/shared/application/base/command-base';
import { Result } from '@/shared/domain/base/result';
import { Guard } from '@/shared/domain/guards/guard';
import { DomainEventBusService } from '@/shared/infra/event-bus/domain-event-bus.service';

import { CreateFieldViewModel } from '../../viewmodels/create-field/create-field.viewmodel';
import { CreateFieldCommand } from './create-field.command';

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
      const validateCommandProps = Guard.combine([
        Guard.againstNullOrUndefined('tenantId', command.tenantId),
        Guard.againstNullOrUndefined('organizationId', command.organizationId),
        Guard.againstNullOrUndefined('context', command.context),
        Guard.againstNullOrUndefined('key', command.key),
      ]);
      if (validateCommandProps.isFailure) {
        throw validateCommandProps.getErrorValue();
      }
      const field = FieldEntity.create({
        ...command,
        active: true,
      });
      const exists = await this.fieldRepository.getByTenantContextKey({
        tenantId: command.tenantId,
        organizationId: command.organizationId,
        context: command.context,
        key: command.key,
      });
      if (exists) {
        return Result.fail<CreateFieldViewModel>(FieldAlreadyExistsException.create(command.key));
      }

      await this.fieldRepository.create(field);

      this.domainEventBusService.publishAll(field.domainEvents);

      return Result.ok<CreateFieldViewModel>(
        CreateFieldViewModel.create({
          key: field.key,
        }),
      );
    } catch (error) {
      return Result.fail<CreateFieldViewModel>(error as Error);
    }
  }
}
