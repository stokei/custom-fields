import { FieldEntity } from '@/modules/fields/domain/entities/field.entity';
import { FieldNotFoundException } from '@/modules/fields/domain/errors/field-not-found-exception';
import { FieldOptionAlreadyExistsException } from '@/modules/fields/domain/errors/field-option-already-exists-exception';
import {
  FieldRepository,
  INJECT_FIELD_REPOSITORY_KEY,
} from '@/modules/fields/domain/repositories/field.repository';
import { DomainEventBusService } from '@/shared/infra/event-bus/domain-event-bus.service';
import { domainEventBusServiceMock } from '@/tests/mocks/event-bus/domain-event-bus-service.mock';
import { fieldRepositoryMock } from '@/tests/mocks/fields/repositories/field-repository.mock';
import { createTestingModule } from '@/tests/mocks/server/create-testing-module';
import { createSingleSelectFieldEntityStub } from '@/tests/stubs/fields/entities/single-select.stub';
import { tenantContextStub } from '@/tests/stubs/http/tenant-context.stub';

import { CreateFieldOptionViewModel } from '../../viewmodels/create-field-option/create-field-option.viewmodel';
import { CreateFieldOptionCommand } from './create-field-option.command';
import { CreateFieldOptionHandler } from './create-field-option.handler';

const createFieldOptionCommand = new CreateFieldOptionCommand({
  field: {
    ...tenantContextStub,
    context: 'CUSTOMER',
    key: 'status',
  },
  option: {
    value: 'new-option',
    label: 'New Option',
  },
});

describe(CreateFieldOptionHandler.name, () => {
  let createFieldOptionHandler: CreateFieldOptionHandler;
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
    createFieldOptionHandler = module.get(CreateFieldOptionHandler);
    domainEventBusService = module.get(DomainEventBusService);
    fieldRepository = module.get(INJECT_FIELD_REPOSITORY_KEY);
    fieldEntityStub = createSingleSelectFieldEntityStub(createFieldOptionCommand.field);
  });

  it('should return successfully with correct data', async () => {
    jest.spyOn(fieldRepository, 'getByTenantContextKey').mockResolvedValue(fieldEntityStub);
    jest.spyOn(fieldRepository, 'update').mockResolvedValue(undefined);
    jest.spyOn(domainEventBusService, 'publishAll').mockResolvedValue(undefined);

    expect(fieldEntityStub.options[fieldEntityStub.options.length - 1].label).not.toStrictEqual(
      createFieldOptionCommand.option.label,
    );

    const createFieldPromise = await createFieldOptionHandler.execute(createFieldOptionCommand);

    expect(fieldRepositoryMock.getByTenantContextKey).toHaveBeenCalledTimes(1);
    expect(fieldRepositoryMock.update).toHaveBeenCalledTimes(1);
    expect(fieldRepositoryMock.update).toHaveBeenCalledWith(fieldEntityStub);
    expect(fieldEntityStub.options[fieldEntityStub.options.length - 1].label).toStrictEqual(
      createFieldOptionCommand.option.label,
    );
    expect(domainEventBusServiceMock.publishAll).toHaveBeenCalledTimes(1);
    expect(createFieldPromise.isSuccess).toBeTruthy();
    expect(createFieldPromise.getValue()).toStrictEqual(
      CreateFieldOptionViewModel.create({
        value: createFieldOptionCommand.option.value,
      }),
    );
  });

  it('should throw error when field option already exists', async () => {
    jest.spyOn(fieldRepository, 'getByTenantContextKey').mockResolvedValue(fieldEntityStub);
    createFieldOptionCommand.option = fieldEntityStub.options[0];

    const createFieldOptionPromise =
      await createFieldOptionHandler.execute(createFieldOptionCommand);
    expect(domainEventBusServiceMock.publishAll).toHaveBeenCalledTimes(0);
    expect(createFieldOptionPromise.isFailure).toBeTruthy();
    expect(createFieldOptionPromise.getErrorValue()).toStrictEqual(
      FieldOptionAlreadyExistsException.create(createFieldOptionCommand.option.value),
    );
  });

  it('should return error when field not found', async () => {
    jest.spyOn(fieldRepository, 'getByTenantContextKey').mockResolvedValue(undefined);
    const createFieldOptionPromise =
      await createFieldOptionHandler.execute(createFieldOptionCommand);

    expect(fieldRepositoryMock.update).toHaveBeenCalledTimes(0);
    expect(domainEventBusServiceMock.publishAll).toHaveBeenCalledTimes(0);
    expect(createFieldOptionPromise.isFailure).toBeTruthy();
    expect(createFieldOptionPromise.getErrorValue()).toStrictEqual(
      FieldNotFoundException.create(fieldEntityStub.key),
    );
  });
});
