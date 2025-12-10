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

import { RemoveFieldViewModel } from '../../viewmodels/remove-field/remove-field.viewmodel';
import { RemoveFieldCommand } from './remove-field.command';
import { RemoveFieldHandler } from './remove-field.handler';

const removeFieldCommand = new RemoveFieldCommand({
  ...tenantContextStub,
  context: 'CUSTOMER',
  key: 'status',
});
const singleSelectFieldEntityStub = createSingleSelectFieldEntityStub(
  removeFieldCommand,
  new UniqueEntityID('field-removed-id'),
);

describe(RemoveFieldHandler.name, () => {
  let removeFieldHandler: RemoveFieldHandler;
  let domainEventBusService: DomainEventBusService;
  let fieldRepository: FieldRepository;

  beforeEach(async () => {
    const module = await createTestingModule()
      .overrideProvider(INJECT_FIELD_REPOSITORY_KEY)
      .useValue(fieldRepositoryMock)
      .overrideProvider(DomainEventBusService)
      .useValue(domainEventBusServiceMock)
      .compile();
    removeFieldHandler = module.get(RemoveFieldHandler);
    domainEventBusService = module.get(DomainEventBusService);
    fieldRepository = module.get(INJECT_FIELD_REPOSITORY_KEY);
  });

  it('should return successfully with correct data', async () => {
    jest
      .spyOn(fieldRepository, 'getByTenantContextKey')
      .mockResolvedValue(singleSelectFieldEntityStub);
    jest.spyOn(fieldRepository, 'remove').mockResolvedValue();
    jest.spyOn(domainEventBusService, 'publishAll').mockResolvedValue(undefined);
    const removeFieldPromise = await removeFieldHandler.execute(removeFieldCommand);

    expect(fieldRepositoryMock.remove).toHaveBeenCalledTimes(1);
    expect(domainEventBusServiceMock.publishAll).toHaveBeenCalledTimes(1);
    expect(singleSelectFieldEntityStub.domainEvents.length).toStrictEqual(1);
    expect(removeFieldPromise.isSuccess).toBeTruthy();
    expect(removeFieldPromise.getValue()).toStrictEqual(
      RemoveFieldViewModel.create({ id: singleSelectFieldEntityStub.id }),
    );
  });

  it('should throw error when field not found', async () => {
    jest.spyOn(fieldRepository, 'getByTenantContextKey').mockResolvedValue(undefined);
    const removeFieldPromise = await removeFieldHandler.execute(removeFieldCommand);

    expect(fieldRepositoryMock.remove).toHaveBeenCalledTimes(0);
    expect(domainEventBusServiceMock.publishAll).toHaveBeenCalledTimes(0);
    expect(removeFieldPromise.isFailure).toBeTruthy();
    expect(removeFieldPromise.getErrorValue()).toStrictEqual(
      FieldNotFoundException.create(singleSelectFieldEntityStub.key),
    );
  });

  it('should return error when required params are empty', async () => {
    removeFieldCommand.context = undefined as unknown as string;
    const removeFieldPromise = await removeFieldHandler.execute(removeFieldCommand);

    expect(fieldRepositoryMock.remove).toHaveBeenCalledTimes(0);
    expect(domainEventBusServiceMock.publishAll).toHaveBeenCalledTimes(0);
    expect(removeFieldPromise.isFailure).toBeTruthy();
    expect(removeFieldPromise.getErrorValue()).toStrictEqual(
      ArgumentNullOrUndefinedException.create('context'),
    );
  });
});
