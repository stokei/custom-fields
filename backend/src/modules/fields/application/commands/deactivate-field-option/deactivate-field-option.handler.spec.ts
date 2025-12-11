import { FieldEntity } from '@/modules/fields/domain/entities/field.entity';
import { FieldNotFoundException } from '@/modules/fields/domain/errors/field-not-found-exception';
import { FieldOptionAlreadyDeactivatedException } from '@/modules/fields/domain/errors/field-option-already-deactivated-exception';
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

import { DeactivateFieldOptionViewModel } from '../../viewmodels/deactivate-field-option/deactivate-field-option.viewmodel';
import { DeactivateFieldOptionCommand } from './deactivate-field-option.command';
import { DeactivateFieldOptionHandler } from './deactivate-field-option.handler';

const deactivateFieldOptionCommand = new DeactivateFieldOptionCommand({
  field: {
    ...tenantContextStub,
    context: 'CUSTOMER',
    key: 'status',
  },
  option: {
    value: 'one',
  },
});

describe(DeactivateFieldOptionHandler.name, () => {
  let deactivateFieldOptionHandler: DeactivateFieldOptionHandler;
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
    deactivateFieldOptionHandler = module.get(DeactivateFieldOptionHandler);
    domainEventBusService = module.get(DomainEventBusService);
    fieldRepository = module.get(INJECT_FIELD_REPOSITORY_KEY);
    fieldEntityStub = createSingleSelectFieldEntityStub(
      {
        ...deactivateFieldOptionCommand.field,
        options: [
          {
            label: 'Option 1',
            value: deactivateFieldOptionCommand.option.value,
            active: true,
          },
        ],
      },
      new UniqueEntityID('field-deactivated-id'),
    );
  });

  it('should return successfully with correct data', async () => {
    jest.spyOn(fieldRepository, 'getByTenantContextKey').mockResolvedValue(fieldEntityStub);
    jest.spyOn(fieldRepository, 'update').mockResolvedValue();
    jest.spyOn(domainEventBusService, 'publishAll').mockResolvedValue(undefined);

    expect(fieldEntityStub.options[0].active).toStrictEqual(true);

    const deactivateFieldOptionPromise = await deactivateFieldOptionHandler.execute(
      deactivateFieldOptionCommand,
    );

    expect(fieldRepositoryMock.update).toHaveBeenCalledTimes(1);
    expect(fieldRepositoryMock.update).toHaveBeenCalledWith(fieldEntityStub);
    expect(fieldEntityStub.options[0].active).toStrictEqual(false);
    expect(domainEventBusServiceMock.publishAll).toHaveBeenCalledTimes(1);
    expect(deactivateFieldOptionPromise.isSuccess).toBeTruthy();
    expect(deactivateFieldOptionPromise.getValue()).toStrictEqual(
      DeactivateFieldOptionViewModel.create({ value: deactivateFieldOptionCommand.option.value }),
    );
  });

  it('should return error when field not found', async () => {
    const deactivateFieldOptionPromise = await deactivateFieldOptionHandler.execute(
      deactivateFieldOptionCommand,
    );

    expect(fieldRepositoryMock.update).toHaveBeenCalledTimes(0);
    expect(domainEventBusServiceMock.publishAll).toHaveBeenCalledTimes(0);
    expect(deactivateFieldOptionPromise.isFailure).toBeTruthy();
    expect(deactivateFieldOptionPromise.getErrorValue()).toStrictEqual(
      FieldNotFoundException.create(fieldEntityStub.key),
    );
  });

  it('should return error when field option already deactivated', async () => {
    fieldEntityStub = createSingleSelectFieldEntityStub(
      {
        ...deactivateFieldOptionCommand.field,
        options: [
          {
            label: 'Option 1',
            value: deactivateFieldOptionCommand.option.value,
            active: false,
          },
        ],
      },
      new UniqueEntityID('field-deactivated-id'),
    );

    jest.spyOn(fieldRepository, 'getByTenantContextKey').mockResolvedValue(fieldEntityStub);

    const deactivateFieldOptionPromise = await deactivateFieldOptionHandler.execute(
      deactivateFieldOptionCommand,
    );

    expect(fieldRepositoryMock.update).toHaveBeenCalledTimes(0);
    expect(domainEventBusServiceMock.publishAll).toHaveBeenCalledTimes(0);
    expect(deactivateFieldOptionPromise.isFailure).toBeTruthy();
    expect(deactivateFieldOptionPromise.getErrorValue()).toStrictEqual(
      FieldOptionAlreadyDeactivatedException.create(deactivateFieldOptionCommand.option.value),
    );
  });

  it('should return error when required params are empty', async () => {
    deactivateFieldOptionCommand.field.context = undefined as unknown as string;
    const deactivateFieldOptionPromise = await deactivateFieldOptionHandler.execute(
      deactivateFieldOptionCommand,
    );

    expect(fieldRepositoryMock.update).toHaveBeenCalledTimes(0);
    expect(domainEventBusServiceMock.publishAll).toHaveBeenCalledTimes(0);
    expect(deactivateFieldOptionPromise.isFailure).toBeTruthy();
    expect(deactivateFieldOptionPromise.getErrorValue()).toStrictEqual(
      ArgumentNullOrUndefinedException.create('context'),
    );
  });
});
