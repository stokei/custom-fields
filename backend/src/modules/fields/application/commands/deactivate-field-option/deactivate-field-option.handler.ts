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

import { DeactivateFieldOptionViewModel } from '../../viewmodels/deactivate-field-option/deactivate-field-option.viewmodel';
import { DeactivateFieldOptionCommand } from './deactivate-field-option.command';

export type DeactivateFieldOptionCommandResponse = Result<DeactivateFieldOptionViewModel>;
@CommandHandler(DeactivateFieldOptionCommand)
export class DeactivateFieldOptionHandler extends CommandHandlerBase<
  DeactivateFieldOptionCommand,
  Promise<DeactivateFieldOptionCommandResponse>
> {
  constructor(
    @InjectFieldRepository()
    private readonly fieldRepository: FieldRepository,
    private readonly domainEventBusService: DomainEventBusService,
  ) {
    super();
  }

  async execute(command: DeactivateFieldOptionCommand) {
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
        return Result.fail<DeactivateFieldOptionViewModel>(
          FieldNotFoundException.create(command.field.key),
        );
      }

      field.deactivateOption(command.option.value);
      await this.fieldRepository.update(field);

      this.domainEventBusService.publishAll(field.domainEvents);

      return Result.ok<DeactivateFieldOptionViewModel>(
        DeactivateFieldOptionViewModel.create({
          value: command.option.value,
        }),
      );
    } catch (error) {
      return Result.fail<DeactivateFieldOptionViewModel>(error as Error);
    }
  }
}
