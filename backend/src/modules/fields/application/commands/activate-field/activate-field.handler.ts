import { CommandHandler } from '@nestjs/cqrs';

import { FieldAlreadyActivatedException } from '@/modules/fields/domain/errors/field-already-activated-exception';
import { FieldNotFoundException } from '@/modules/fields/domain/errors/field-not-found-exception';
import {
  FieldRepository,
  InjectFieldRepository,
} from '@/modules/fields/domain/repositories/field.repository';
import { CommandHandlerBase } from '@/shared/application/base/command-base';
import { Result } from '@/shared/domain/base/result';
import { Guard } from '@/shared/domain/guards/guard';
import { DomainEventBusService } from '@/shared/infra/event-bus/domain-event-bus.service';

import { ActivateFieldViewModel } from '../../viewmodels/activate-field/activate-field.viewmodel';
import { ActivateFieldCommand } from './activate-field.command';

export type ActivateFieldCommandResponse = Result<ActivateFieldViewModel>;
@CommandHandler(ActivateFieldCommand)
export class ActivateFieldHandler extends CommandHandlerBase<
  ActivateFieldCommand,
  Promise<ActivateFieldCommandResponse>
> {
  constructor(
    @InjectFieldRepository()
    private readonly fieldRepository: FieldRepository,
    private readonly domainEventBusService: DomainEventBusService,
  ) {
    super();
  }

  async execute(command: ActivateFieldCommand) {
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
        return Result.fail<ActivateFieldViewModel>(FieldNotFoundException.create(command.key));
      }
      if (field.active) {
        return Result.fail<ActivateFieldViewModel>(
          FieldAlreadyActivatedException.create(command.key),
        );
      }

      field.activate();
      await this.fieldRepository.update(field);

      this.domainEventBusService.publishAll(field.domainEvents);

      return Result.ok<ActivateFieldViewModel>(
        ActivateFieldViewModel.create({
          id: field.id,
        }),
      );
    } catch (error) {
      return Result.fail<ActivateFieldViewModel>(error as Error);
    }
  }
}
