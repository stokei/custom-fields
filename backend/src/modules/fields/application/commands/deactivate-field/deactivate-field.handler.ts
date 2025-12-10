import { CommandHandler } from '@nestjs/cqrs';

import { FieldAlreadyDeactivatedException } from '@/modules/fields/domain/errors/field-already-deactivated-exception';
import { FieldNotFoundException } from '@/modules/fields/domain/errors/field-not-found-exception';
import {
  FieldRepository,
  InjectFieldRepository,
} from '@/modules/fields/domain/repositories/field.repository';
import { CommandHandlerBase } from '@/shared/application/base/command-base';
import { Result } from '@/shared/domain/base/result';
import { Guard } from '@/shared/domain/guards/guard';
import { DomainEventBusService } from '@/shared/infra/event-bus/domain-event-bus.service';

import { DeactivateFieldViewModel } from '../../viewmodels/deactivate-field/deactivate-field.viewmodel';
import { DeactivateFieldCommand } from './deactivate-field.command';

export type DeactivateFieldCommandResponse = Result<DeactivateFieldViewModel>;
@CommandHandler(DeactivateFieldCommand)
export class DeactivateFieldHandler extends CommandHandlerBase<
  DeactivateFieldCommand,
  Promise<DeactivateFieldCommandResponse>
> {
  constructor(
    @InjectFieldRepository()
    private readonly fieldRepository: FieldRepository,
    private readonly domainEventBusService: DomainEventBusService,
  ) {
    super();
  }

  async execute(command: DeactivateFieldCommand) {
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
      const field = await this.fieldRepository.getByTenantContextKey({
        tenantId: command.tenantId,
        organizationId: command.organizationId,
        context: command.context,
        key: command.key,
      });
      if (!field) {
        return Result.fail<DeactivateFieldViewModel>(FieldNotFoundException.create(command.key));
      }
      if (!field.active) {
        return Result.fail<DeactivateFieldViewModel>(
          FieldAlreadyDeactivatedException.create(command.key),
        );
      }

      field.deactivate();
      await this.fieldRepository.update(field);

      this.domainEventBusService.publishAll(field.domainEvents);

      return Result.ok<DeactivateFieldViewModel>(
        DeactivateFieldViewModel.create({
          id: field.id,
        }),
      );
    } catch (error) {
      return Result.fail<DeactivateFieldViewModel>(error as Error);
    }
  }
}
