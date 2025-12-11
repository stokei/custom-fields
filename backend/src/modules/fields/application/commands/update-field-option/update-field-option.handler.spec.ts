import { FieldEntity } from '@/modules/fields/domain/entities/field.entity';
import { FieldNotFoundException } from '@/modules/fields/domain/errors/field-not-found-exception';
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

import { UpdateFieldOptionViewModel } from '../../viewmodels/update-field-option/update-field-option.viewmodel';
import { UpdateFieldOptionCommand } from './update-field-option.command';
import { UpdateFieldOptionHandler } from './update-field-option.handler';

const updateFieldOptionCommand = new UpdateFieldOptionCommand({
  field: {
    ...tenantContextStub,
    context: 'CUSTOMER',
    key: 'status',
  },
  option: {
    where: {
      value: 'one',
    },
    data: {
      label: 'My updated label',
    },
  },
});

describe(UpdateFieldOptionHandler.name, () => {
  let updateFieldOptionHandler: UpdateFieldOptionHandler;
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
    updateFieldOptionHandler = module.get(UpdateFieldOptionHandler);
    domainEventBusService = module.get(DomainEventBusService);
    fieldRepository = module.get(INJECT_FIELD_REPOSITORY_KEY);
    fieldEntityStub = createSingleSelectFieldEntityStub(
      {
        options: [
          {
            label: 'Any',
            value: updateFieldOptionCommand.option.where.value,
          },
        ],
      },
      new UniqueEntityID('field-updated-id'),
    );
  });

  it('should return successfully with correct data', async () => {
    jest.spyOn(fieldRepository, 'getByTenantContextKey').mockResolvedValue(fieldEntityStub);
    jest.spyOn(fieldRepository, 'update').mockResolvedValue();
    jest.spyOn(domainEventBusService, 'publishAll').mockResolvedValue(undefined);
    const updateFieldOptionPromise =
      await updateFieldOptionHandler.execute(updateFieldOptionCommand);

    expect(fieldRepositoryMock.update).toHaveBeenCalledTimes(1);
    expect(fieldRepositoryMock.update).toHaveBeenCalledWith(fieldEntityStub);
    expect(fieldEntityStub.options[0].label).toStrictEqual(
      updateFieldOptionCommand.option.data.label,
    );
    expect(domainEventBusServiceMock.publishAll).toHaveBeenCalledTimes(1);
    expect(updateFieldOptionPromise.isSuccess).toBeTruthy();
    expect(updateFieldOptionPromise.getValue()).toStrictEqual(
      UpdateFieldOptionViewModel.create({ value: updateFieldOptionCommand.option.where.value }),
    );
  });

  it('should return error when field not found', async () => {
    jest.spyOn(fieldRepository, 'getByTenantContextKey').mockResolvedValue(undefined);
    const updateFieldOptionPromise =
      await updateFieldOptionHandler.execute(updateFieldOptionCommand);

    expect(fieldRepositoryMock.update).toHaveBeenCalledTimes(0);
    expect(domainEventBusServiceMock.publishAll).toHaveBeenCalledTimes(0);
    expect(updateFieldOptionPromise.isFailure).toBeTruthy();
    expect(updateFieldOptionPromise.getErrorValue()).toStrictEqual(
      FieldNotFoundException.create(fieldEntityStub.key),
    );
  });

  it('should return error when required params are empty', async () => {
    updateFieldOptionCommand.field.context = undefined as unknown as string;
    const updateFieldOptionPromise =
      await updateFieldOptionHandler.execute(updateFieldOptionCommand);

    expect(fieldRepositoryMock.update).toHaveBeenCalledTimes(0);
    expect(domainEventBusServiceMock.publishAll).toHaveBeenCalledTimes(0);
    expect(updateFieldOptionPromise.isFailure).toBeTruthy();
    expect(updateFieldOptionPromise.getErrorValue()).toStrictEqual(
      ArgumentNullOrUndefinedException.create('context'),
    );
  });
});
