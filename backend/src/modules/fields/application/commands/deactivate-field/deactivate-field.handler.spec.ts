import { FieldEntity } from '@/modules/fields/domain/entities/field.entity';
import { FieldAlreadyDeactivatedException } from '@/modules/fields/domain/errors/field-already-deactivated-exception';
import { FieldNotFoundException } from '@/modules/fields/domain/errors/field-not-found-exception';
import { FieldDeactivatedEvent } from '@/modules/fields/domain/events/field-deactivated/field-deactivated.event';
import {
  FieldRepository,
  INJECT_FIELD_REPOSITORY_KEY,
} from '@/modules/fields/domain/repositories/field.repository';
import { ArgumentNullOrUndefinedException } from '@/shared/domain/errors/guards/argument-null-or-undefined-exception';
import { UniqueEntityID } from '@/shared/domain/utils/unique-entity-id';
import { DomainEventBusService } from '@/shared/infra/event-bus/domain-event-bus.service';
import { domainEventBusServiceMock } from '@/tests/mocks/event-bus/domain-event-bus-service.mock';
import { fieldRepositoryMock } from '@/tests/mocks/fields/repositories/field-repository.mock';
import { createTestingModule } from '@/tests/mocks/server/create-testing-module';
import { createSingleSelectFieldEntityStub } from '@/tests/stubs/fields/entities/single-select.stub';
import { tenantContextStub } from '@/tests/stubs/http/tenant-context.stub';

import { DeactivateFieldViewModel } from '../../viewmodels/deactivate-field/deactivate-field.viewmodel';
import { DeactivateFieldCommand } from './deactivate-field.command';
import { DeactivateFieldHandler } from './deactivate-field.handler';

const deactivateFieldCommand = new DeactivateFieldCommand({
  ...tenantContextStub,
  context: 'CUSTOMER',
  key: 'status',
});

describe(DeactivateFieldHandler.name, () => {
  let deactivateFieldHandler: DeactivateFieldHandler;
  let domainEventBusService: DomainEventBusService;
  let fieldRepository: FieldRepository;
  let fieldEntityStub: FieldEntity;

  beforeEach(async () => {
    const module = await createTestingModule()
      .overrideProvider(INJECT_FIELD_REPOSITORY_KEY)
      .useValue(fieldRepositoryMock)
      .overrideProvider(DomainEventBusService)
      .useValue(domainEventBusServiceMock)
      .compile();
    deactivateFieldHandler = module.get(DeactivateFieldHandler);
    domainEventBusService = module.get(DomainEventBusService);
    fieldRepository = module.get(INJECT_FIELD_REPOSITORY_KEY);
    fieldEntityStub = createSingleSelectFieldEntityStub(
      deactivateFieldCommand,
      new UniqueEntityID('field-deactivated-id'),
    );
  });

  it('should return successfully with correct data', async () => {
    jest.spyOn(fieldRepository, 'getByTenantContextKey').mockResolvedValue(fieldEntityStub);
    jest.spyOn(fieldRepository, 'update').mockResolvedValue();
    jest.spyOn(domainEventBusService, 'publishAll').mockResolvedValue(undefined);
    const deactivateFieldPromise = await deactivateFieldHandler.execute(deactivateFieldCommand);

    expect(fieldRepositoryMock.update).toHaveBeenCalledTimes(1);
    expect(fieldRepositoryMock.update).toHaveBeenCalledWith(fieldEntityStub);
    expect(fieldEntityStub.active).toStrictEqual(false);
    expect(domainEventBusServiceMock.publishAll).toHaveBeenCalledTimes(1);
    expect(fieldEntityStub.domainEvents.length).toStrictEqual(1);
    expect(fieldEntityStub.domainEvents[0] instanceof FieldDeactivatedEvent).toBeTruthy();
    expect(deactivateFieldPromise.isSuccess).toBeTruthy();
    expect(deactivateFieldPromise.getValue()).toStrictEqual(
      DeactivateFieldViewModel.create({ key: fieldEntityStub.key }),
    );
  });

  it('should return error when field not found', async () => {
    jest.spyOn(fieldRepository, 'getByTenantContextKey').mockResolvedValue(undefined);
    const deactivateFieldPromise = await deactivateFieldHandler.execute(deactivateFieldCommand);

    expect(fieldRepositoryMock.update).toHaveBeenCalledTimes(0);
    expect(domainEventBusServiceMock.publishAll).toHaveBeenCalledTimes(0);
    expect(deactivateFieldPromise.isFailure).toBeTruthy();
    expect(deactivateFieldPromise.getErrorValue()).toStrictEqual(
      FieldNotFoundException.create(fieldEntityStub.key),
    );
  });

  it('should return error when field already deactivated', async () => {
    fieldEntityStub = createSingleSelectFieldEntityStub(
      {
        ...deactivateFieldCommand,
        active: false,
      },
      new UniqueEntityID('field-deactivated-id'),
    );
    jest.spyOn(fieldRepository, 'getByTenantContextKey').mockResolvedValue(fieldEntityStub);
    const deactivateFieldPromise = await deactivateFieldHandler.execute(deactivateFieldCommand);

    expect(fieldRepositoryMock.update).toHaveBeenCalledTimes(0);
    expect(domainEventBusServiceMock.publishAll).toHaveBeenCalledTimes(0);
    expect(deactivateFieldPromise.isFailure).toBeTruthy();
    expect(deactivateFieldPromise.getErrorValue()).toStrictEqual(
      FieldAlreadyDeactivatedException.create(fieldEntityStub.key),
    );
  });

  it('should return error when required params are empty', async () => {
    deactivateFieldCommand.context = undefined as unknown as string;
    const deactivateFieldPromise = await deactivateFieldHandler.execute(deactivateFieldCommand);

    expect(fieldRepositoryMock.update).toHaveBeenCalledTimes(0);
    expect(domainEventBusServiceMock.publishAll).toHaveBeenCalledTimes(0);
    expect(deactivateFieldPromise.isFailure).toBeTruthy();
    expect(deactivateFieldPromise.getErrorValue()).toStrictEqual(
      ArgumentNullOrUndefinedException.create('context'),
    );
  });
});
