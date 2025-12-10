import { FieldEntity } from '@/modules/fields/domain/entities/field.entity';
import { FieldNotFoundException } from '@/modules/fields/domain/errors/field-not-found-exception';
import { FieldUpdatedEvent } from '@/modules/fields/domain/events/field-updated/field-updated.event';
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

import { UpdateFieldViewModel } from '../../viewmodels/update-field/update-field.viewmodel';
import { UpdateFieldCommand } from './update-field.command';
import { UpdateFieldHandler } from './update-field.handler';

const updateFieldCommand = new UpdateFieldCommand({
  where: {
    ...tenantContextStub,
    context: 'CUSTOMER',
    key: 'status',
  },
  data: {
    label: 'My updated label',
    required: true,
    minLength: 6,
    maxLength: 100,
    pattern: '[0-5]',
    placeholder: 'My updated placeholder',
    group: 'GROUPZ',
    order: 75,
  },
});

describe(UpdateFieldHandler.name, () => {
  let updateFieldHandler: UpdateFieldHandler;
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
    updateFieldHandler = module.get(UpdateFieldHandler);
    domainEventBusService = module.get(DomainEventBusService);
    fieldRepository = module.get(INJECT_FIELD_REPOSITORY_KEY);
    fieldEntityStub = createSingleSelectFieldEntityStub({}, new UniqueEntityID('field-updated-id'));
  });

  it('should return successfully with correct data', async () => {
    jest.spyOn(fieldRepository, 'getByTenantContextKey').mockResolvedValue(fieldEntityStub);
    jest.spyOn(fieldRepository, 'update').mockResolvedValue();
    jest.spyOn(domainEventBusService, 'publishAll').mockResolvedValue(undefined);
    const updateFieldPromise = await updateFieldHandler.execute(updateFieldCommand);

    expect(fieldRepositoryMock.update).toHaveBeenCalledTimes(1);
    expect(fieldRepositoryMock.update).toHaveBeenCalledWith(fieldEntityStub);
    expect(fieldEntityStub.label).toStrictEqual(updateFieldCommand.data.label);
    expect(fieldEntityStub.required).toStrictEqual(updateFieldCommand.data.required);
    expect(fieldEntityStub.minLength).toStrictEqual(updateFieldCommand.data.minLength);
    expect(fieldEntityStub.maxLength).toStrictEqual(updateFieldCommand.data.maxLength);
    expect(fieldEntityStub.pattern).toStrictEqual(updateFieldCommand.data.pattern);
    expect(fieldEntityStub.placeholder).toStrictEqual(updateFieldCommand.data.placeholder);
    expect(fieldEntityStub.group).toStrictEqual(updateFieldCommand.data.group);
    expect(fieldEntityStub.order).toStrictEqual(updateFieldCommand.data.order);
    expect(domainEventBusServiceMock.publishAll).toHaveBeenCalledTimes(1);
    expect(fieldEntityStub.domainEvents.length).toStrictEqual(1);
    expect(fieldEntityStub.domainEvents[0] instanceof FieldUpdatedEvent).toBeTruthy();
    expect(updateFieldPromise.isSuccess).toBeTruthy();
    expect(updateFieldPromise.getValue()).toStrictEqual(
      UpdateFieldViewModel.create({ id: fieldEntityStub.id }),
    );
  });

  it('should return error when field not found', async () => {
    jest.spyOn(fieldRepository, 'getByTenantContextKey').mockResolvedValue(undefined);
    const updateFieldPromise = await updateFieldHandler.execute(updateFieldCommand);

    expect(fieldRepositoryMock.update).toHaveBeenCalledTimes(0);
    expect(domainEventBusServiceMock.publishAll).toHaveBeenCalledTimes(0);
    expect(updateFieldPromise.isFailure).toBeTruthy();
    expect(updateFieldPromise.getErrorValue()).toStrictEqual(
      FieldNotFoundException.create(fieldEntityStub.key),
    );
  });

  it('should return error when required params are empty', async () => {
    updateFieldCommand.where.context = undefined as unknown as string;
    const updateFieldPromise = await updateFieldHandler.execute(updateFieldCommand);

    expect(fieldRepositoryMock.update).toHaveBeenCalledTimes(0);
    expect(domainEventBusServiceMock.publishAll).toHaveBeenCalledTimes(0);
    expect(updateFieldPromise.isFailure).toBeTruthy();
    expect(updateFieldPromise.getErrorValue()).toStrictEqual(
      ArgumentNullOrUndefinedException.create('context'),
    );
  });
});
