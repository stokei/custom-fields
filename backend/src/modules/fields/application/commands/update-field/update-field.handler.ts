import { CommandHandler } from '@nestjs/cqrs';

import { FieldNotFoundException } from '@/modules/fields/domain/errors/field-not-found-exception';
import {
  FieldRepository,
  InjectFieldRepository,
} from '@/modules/fields/domain/repositories/field.repository';
import { CommandHandlerBase } from '@/shared/application/base/command-base';
import { Result } from '@/shared/domain/base/result';
import { Guard } from '@/shared/domain/guards/guard';
import { DomainEventBusService } from '@/shared/infra/event-bus/domain-event-bus.service';

import { UpdateFieldViewModel } from '../../viewmodels/update-field/update-field.viewmodel';
import { UpdateFieldCommand } from './update-field.command';

export type UpdateFieldCommandResponse = Result<UpdateFieldViewModel>;
@CommandHandler(UpdateFieldCommand)
export class UpdateFieldHandler extends CommandHandlerBase<
  UpdateFieldCommand,
  Promise<UpdateFieldCommandResponse>
> {
  constructor(
    @InjectFieldRepository()
    private readonly fieldRepository: FieldRepository,
    private readonly domainEventBusService: DomainEventBusService,
  ) {
    super();
  }

  async execute(command: UpdateFieldCommand) {
    try {
      const validateCommandProps = Guard.combine([
        Guard.againstNullOrUndefined('tenantId', command.where.tenantId),
        Guard.againstNullOrUndefined('organizationId', command.where.organizationId),
        Guard.againstNullOrUndefined('context', command.where.context),
        Guard.againstNullOrUndefined('key', command.where.key),
      ]);
      if (validateCommandProps.isFailure) {
        throw validateCommandProps.getErrorValue();
      }
      const field = await this.fieldRepository.getByTenantContextKey({
        tenantId: command.where.tenantId,
        organizationId: command.where.organizationId,
        context: command.where.context,
        key: command.where.key,
      });
      if (!field) {
        return Result.fail<UpdateFieldViewModel>(FieldNotFoundException.create(command.where.key));
      }

      field.update(command.data);
      await this.fieldRepository.update(field);

      this.domainEventBusService.publishAll(field.domainEvents);

      return Result.ok<UpdateFieldViewModel>(
        UpdateFieldViewModel.create({
          key: field.key,
        }),
      );
    } catch (error) {
      return Result.fail<UpdateFieldViewModel>(error as Error);
    }
  }
}
