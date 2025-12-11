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

import { UpdateFieldOptionViewModel } from '../../viewmodels/update-field-option/update-field-option.viewmodel';
import { UpdateFieldOptionCommand } from './update-field-option.command';

export type UpdateFieldOptionCommandResponse = Result<UpdateFieldOptionViewModel>;
@CommandHandler(UpdateFieldOptionCommand)
export class UpdateFieldOptionHandler extends CommandHandlerBase<
  UpdateFieldOptionCommand,
  Promise<UpdateFieldOptionCommandResponse>
> {
  constructor(
    @InjectFieldRepository()
    private readonly fieldRepository: FieldRepository,
    private readonly domainEventBusService: DomainEventBusService,
  ) {
    super();
  }

  async execute(command: UpdateFieldOptionCommand) {
    try {
      const validateCommandProps = Guard.combine([
        Guard.againstNullOrUndefined('tenantId', command.field.tenantId),
        Guard.againstNullOrUndefined('organizationId', command.field.organizationId),
        Guard.againstNullOrUndefined('context', command.field.context),
        Guard.againstNullOrUndefined('key', command.field.key),
      ]);
      if (validateCommandProps.isFailure) {
        throw validateCommandProps.getErrorValue();
      }
      const field = await this.fieldRepository.getByTenantContextKey({
        tenantId: command.field.tenantId,
        organizationId: command.field.organizationId,
        context: command.field.context,
        key: command.field.key,
      });
      if (!field) {
        return Result.fail<UpdateFieldOptionViewModel>(
          FieldNotFoundException.create(command.field.key),
        );
      }

      field.updateOption(command.option.where.value, command.option.data);
      await this.fieldRepository.update(field);

      this.domainEventBusService.publishAll(field.domainEvents);

      return Result.ok<UpdateFieldOptionViewModel>(
        UpdateFieldOptionViewModel.create({
          value: command.option.where.value,
        }),
      );
    } catch (error) {
      return Result.fail<UpdateFieldOptionViewModel>(error as Error);
    }
  }
}
