import { FieldEntity } from '@/modules/fields/domain/entities/field.entity';
import { FieldAlreadyActivatedException } from '@/modules/fields/domain/errors/field-already-activated-exception';
import { FieldNotFoundException } from '@/modules/fields/domain/errors/field-not-found-exception';
import { FieldActivatedEvent } from '@/modules/fields/domain/events/field-activated/field-activated.event';
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

import { ActivateFieldViewModel } from '../../viewmodels/activate-field/activate-field.viewmodel';
import { ActivateFieldCommand } from './activate-field.command';
import { ActivateFieldHandler } from './activate-field.handler';

const activateFieldCommand = new ActivateFieldCommand({
  ...tenantContextStub,
  context: 'CUSTOMER',
  key: 'status',
});

describe(ActivateFieldHandler.name, () => {
  let activateFieldHandler: ActivateFieldHandler;
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
    activateFieldHandler = module.get(ActivateFieldHandler);
    domainEventBusService = module.get(DomainEventBusService);
    fieldRepository = module.get(INJECT_FIELD_REPOSITORY_KEY);
    fieldEntityStub = createSingleSelectFieldEntityStub(
      {
        ...activateFieldCommand,
        active: false,
      },
      new UniqueEntityID('field-activated-id'),
    );
  });

  it('should return successfully with correct data', async () => {
    jest.spyOn(fieldRepository, 'getByTenantContextKey').mockResolvedValue(fieldEntityStub);
    jest.spyOn(fieldRepository, 'update').mockResolvedValue();
    jest.spyOn(domainEventBusService, 'publishAll').mockResolvedValue(undefined);
    const activateFieldPromise = await activateFieldHandler.execute(activateFieldCommand);

    expect(fieldRepositoryMock.update).toHaveBeenCalledTimes(1);
    expect(fieldRepositoryMock.update).toHaveBeenCalledWith(fieldEntityStub);
    expect(fieldEntityStub.active).toStrictEqual(true);
    expect(domainEventBusServiceMock.publishAll).toHaveBeenCalledTimes(1);
    expect(fieldEntityStub.domainEvents.length).toStrictEqual(1);
    expect(fieldEntityStub.domainEvents[0] instanceof FieldActivatedEvent).toBeTruthy();
    expect(activateFieldPromise.isSuccess).toBeTruthy();
    expect(activateFieldPromise.getValue()).toStrictEqual(
      ActivateFieldViewModel.create({ key: fieldEntityStub.key }),
    );
  });

  it('should return error when field not found', async () => {
    jest.spyOn(fieldRepository, 'getByTenantContextKey').mockResolvedValue(undefined);
    const activateFieldPromise = await activateFieldHandler.execute(activateFieldCommand);

    expect(fieldRepositoryMock.update).toHaveBeenCalledTimes(0);
    expect(domainEventBusServiceMock.publishAll).toHaveBeenCalledTimes(0);
    expect(activateFieldPromise.isFailure).toBeTruthy();
    expect(activateFieldPromise.getErrorValue()).toStrictEqual(
      FieldNotFoundException.create(fieldEntityStub.key),
    );
  });

  it('should return error when field already activated', async () => {
    fieldEntityStub = createSingleSelectFieldEntityStub(
      activateFieldCommand,
      new UniqueEntityID('field-activated-id'),
    );
    jest.spyOn(fieldRepository, 'getByTenantContextKey').mockResolvedValue(fieldEntityStub);
    const activateFieldPromise = await activateFieldHandler.execute(activateFieldCommand);

    expect(fieldRepositoryMock.update).toHaveBeenCalledTimes(0);
    expect(domainEventBusServiceMock.publishAll).toHaveBeenCalledTimes(0);
    expect(activateFieldPromise.isFailure).toBeTruthy();
    expect(activateFieldPromise.getErrorValue()).toStrictEqual(
      FieldAlreadyActivatedException.create(fieldEntityStub.key),
    );
  });

  it('should return error when required params are empty', async () => {
    activateFieldCommand.context = undefined as unknown as string;
    const activateFieldPromise = await activateFieldHandler.execute(activateFieldCommand);

    expect(fieldRepositoryMock.update).toHaveBeenCalledTimes(0);
    expect(domainEventBusServiceMock.publishAll).toHaveBeenCalledTimes(0);
    expect(activateFieldPromise.isFailure).toBeTruthy();
    expect(activateFieldPromise.getErrorValue()).toStrictEqual(
      ArgumentNullOrUndefinedException.create('context'),
    );
  });
});
