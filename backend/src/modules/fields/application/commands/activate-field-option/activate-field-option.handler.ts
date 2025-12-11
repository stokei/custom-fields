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

import { ActivateFieldOptionViewModel } from '../../viewmodels/activate-field-option/activate-field-option.viewmodel';
import { ActivateFieldOptionCommand } from './activate-field-option.command';

export type ActivateFieldOptionCommandResponse = Result<ActivateFieldOptionViewModel>;
@CommandHandler(ActivateFieldOptionCommand)
export class ActivateFieldOptionHandler extends CommandHandlerBase<
  ActivateFieldOptionCommand,
  Promise<ActivateFieldOptionCommandResponse>
> {
  constructor(
    @InjectFieldRepository()
    private readonly fieldRepository: FieldRepository,
    private readonly domainEventBusService: DomainEventBusService,
  ) {
    super();
  }

  async execute(command: ActivateFieldOptionCommand) {
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
        return Result.fail<ActivateFieldOptionViewModel>(
          FieldNotFoundException.create(command.field.key),
        );
      }

      field.activateOption(command.option.value);
      await this.fieldRepository.update(field);

      this.domainEventBusService.publishAll(field.domainEvents);

      return Result.ok<ActivateFieldOptionViewModel>(
        ActivateFieldOptionViewModel.create({
          value: command.option.value,
        }),
      );
    } catch (error) {
      return Result.fail<ActivateFieldOptionViewModel>(error as Error);
    }
  }
}
