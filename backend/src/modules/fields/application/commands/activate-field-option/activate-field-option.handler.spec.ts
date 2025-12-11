import { FieldEntity } from '@/modules/fields/domain/entities/field.entity';
import { FieldNotFoundException } from '@/modules/fields/domain/errors/field-not-found-exception';
import { FieldOptionAlreadyActivatedException } from '@/modules/fields/domain/errors/field-option-already-activated-exception';
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

import { ActivateFieldOptionViewModel } from '../../viewmodels/activate-field-option/activate-field-option.viewmodel';
import { ActivateFieldOptionCommand } from './activate-field-option.command';
import { ActivateFieldOptionHandler } from './activate-field-option.handler';

const activateFieldOptionCommand = new ActivateFieldOptionCommand({
  field: {
    ...tenantContextStub,
    context: 'CUSTOMER',
    key: 'status',
  },
  option: {
    value: 'one',
  },
});

describe(ActivateFieldOptionHandler.name, () => {
  let activateFieldOptionHandler: ActivateFieldOptionHandler;
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
    activateFieldOptionHandler = module.get(ActivateFieldOptionHandler);
    domainEventBusService = module.get(DomainEventBusService);
    fieldRepository = module.get(INJECT_FIELD_REPOSITORY_KEY);
    fieldEntityStub = createSingleSelectFieldEntityStub(
      {
        ...activateFieldOptionCommand.field,
        options: [
          {
            label: 'Option 1',
            value: activateFieldOptionCommand.option.value,
            active: false,
          },
        ],
      },
      new UniqueEntityID('field-activated-id'),
    );
  });

  it('should return successfully with correct data', async () => {
    jest.spyOn(fieldRepository, 'getByTenantContextKey').mockResolvedValue(fieldEntityStub);
    jest.spyOn(fieldRepository, 'update').mockResolvedValue();
    jest.spyOn(domainEventBusService, 'publishAll').mockResolvedValue(undefined);

    expect(fieldEntityStub.options[0].active).toStrictEqual(false);

    const activateFieldOptionPromise = await activateFieldOptionHandler.execute(
      activateFieldOptionCommand,
    );

    expect(fieldRepositoryMock.update).toHaveBeenCalledTimes(1);
    expect(fieldRepositoryMock.update).toHaveBeenCalledWith(fieldEntityStub);
    expect(fieldEntityStub.options[0].active).toStrictEqual(true);
    expect(domainEventBusServiceMock.publishAll).toHaveBeenCalledTimes(1);
    expect(activateFieldOptionPromise.isSuccess).toBeTruthy();
    expect(activateFieldOptionPromise.getValue()).toStrictEqual(
      ActivateFieldOptionViewModel.create({ value: activateFieldOptionCommand.option.value }),
    );
  });

  it('should return error when field not found', async () => {
    const activateFieldOptionPromise = await activateFieldOptionHandler.execute(
      activateFieldOptionCommand,
    );

    expect(fieldRepositoryMock.update).toHaveBeenCalledTimes(0);
    expect(domainEventBusServiceMock.publishAll).toHaveBeenCalledTimes(0);
    expect(activateFieldOptionPromise.isFailure).toBeTruthy();
    expect(activateFieldOptionPromise.getErrorValue()).toStrictEqual(
      FieldNotFoundException.create(fieldEntityStub.key),
    );
  });

  it('should return error when field option already activated', async () => {
    fieldEntityStub = createSingleSelectFieldEntityStub(
      {
        ...activateFieldOptionCommand.field,
        options: [
          {
            label: 'Option 1',
            value: activateFieldOptionCommand.option.value,
            active: true,
          },
        ],
      },
      new UniqueEntityID('field-activated-id'),
    );

    jest.spyOn(fieldRepository, 'getByTenantContextKey').mockResolvedValue(fieldEntityStub);

    const activateFieldOptionPromise = await activateFieldOptionHandler.execute(
      activateFieldOptionCommand,
    );

    expect(fieldRepositoryMock.update).toHaveBeenCalledTimes(0);
    expect(domainEventBusServiceMock.publishAll).toHaveBeenCalledTimes(0);
    expect(activateFieldOptionPromise.isFailure).toBeTruthy();
    expect(activateFieldOptionPromise.getErrorValue()).toStrictEqual(
      FieldOptionAlreadyActivatedException.create(activateFieldOptionCommand.option.value),
    );
  });

  it('should return error when required params are empty', async () => {
    activateFieldOptionCommand.field.context = undefined as unknown as string;
    const activateFieldOptionPromise = await activateFieldOptionHandler.execute(
      activateFieldOptionCommand,
    );

    expect(fieldRepositoryMock.update).toHaveBeenCalledTimes(0);
    expect(domainEventBusServiceMock.publishAll).toHaveBeenCalledTimes(0);
    expect(activateFieldOptionPromise.isFailure).toBeTruthy();
    expect(activateFieldOptionPromise.getErrorValue()).toStrictEqual(
      ArgumentNullOrUndefinedException.create('context'),
    );
  });
});
