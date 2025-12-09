import { FieldNotFoundException } from '@/modules/fields/domain/errors/field-not-found-exception';
import {
  FieldRepository,
  InjectFieldRepository,
} from '@/modules/fields/domain/repositories/field.repository';
import { CommandHandlerBase } from '@/shared/application/base/command-base';
import { Result } from '@/shared/domain/base/result';
import { DomainEventBusService } from '@/shared/infra/event-bus/domain-event-bus.service';
import { CommandHandler } from '@nestjs/cqrs';
import { RemoveFieldViewModel } from '../../viewmodels/remove-field/remove-field.viewmodel';
import { RemoveFieldCommand } from './remove-field.command';
import { Guard } from '@/shared/domain/guards/guard';

export type RemoveFieldCommandResponse = Result<RemoveFieldViewModel>;
@CommandHandler(RemoveFieldCommand)
export class RemoveFieldHandler extends CommandHandlerBase<
  RemoveFieldCommand,
  Promise<RemoveFieldCommandResponse>
> {
  constructor(
    @InjectFieldRepository()
    private readonly fieldRepository: FieldRepository,
    private readonly domainEventBusService: DomainEventBusService,
  ) {
    super();
  }

  async execute(command: RemoveFieldCommand) {
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
        return Result.fail<RemoveFieldViewModel>(FieldNotFoundException.create(command.key));
      }

      await this.fieldRepository.remove(field);
      field.remove();

      this.domainEventBusService.publishAll(field.domainEvents);

      return Result.ok<RemoveFieldViewModel>(
        RemoveFieldViewModel.create({
          id: field.id,
        }),
      );
    } catch (error) {
      return Result.fail<RemoveFieldViewModel>(error as Error);
    }
  }
}
