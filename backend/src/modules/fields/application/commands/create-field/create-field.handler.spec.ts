import { FieldAlreadyExistsException } from '@/modules/fields/domain/errors/field-already-exists-exception';
import {
  FieldRepository,
  INJECT_FIELD_REPOSITORY_KEY,
} from '@/modules/fields/domain/repositories/field.repository';
import { FieldTypeEnum } from '@/modules/fields/domain/value-objects/field-type.vo';
import { ArgumentNullOrUndefinedException } from '@/shared/domain/errors/guards/argument-null-or-undefined-exception';
import { DomainEventBusService } from '@/shared/infra/event-bus/domain-event-bus.service';
import { domainEventBusServiceMock } from '@/tests/mocks/event-bus/domain-event-bus-service.mock';
import { fieldRepositoryMock } from '@/tests/mocks/fields/repositories/field-repository.mock';
import { createTestingModule } from '@/tests/mocks/server/create-testing-module';
import { createSingleSelectFieldEntityStub } from '@/tests/stubs/fields/entities/single-select.stub';
import { tenantContextStub } from '@/tests/stubs/http/tenant-context.stub';
import { CreateFieldCommand } from './create-field.command';
import { CreateFieldHandler } from './create-field.handler';

const createFieldCommand = new CreateFieldCommand({
  ...tenantContextStub,
  context: 'CUSTOMER',
  group: 'GENERAL',
  key: 'status',
  label: 'Status',
  type: FieldTypeEnum.SINGLE_SELECT,
  required: true,
  minLength: undefined,
  maxLength: undefined,
  pattern: undefined,
  placeholder: 'Selecione um status',
  order: 10,
  options: [
    { value: 'active', label: 'Ativo' },
    { value: 'inactive', label: 'Inativo' },
  ],
});
const singleSelectFieldEntityStub = createSingleSelectFieldEntityStub(createFieldCommand);

describe(CreateFieldHandler.name, () => {
  let createFieldHandler: CreateFieldHandler;
  let domainEventBusService: DomainEventBusService;
  let fieldRepository: FieldRepository;

  beforeEach(async () => {
    const module = await createTestingModule()
      .overrideProvider(INJECT_FIELD_REPOSITORY_KEY)
      .useValue(fieldRepositoryMock)
      .overrideProvider(DomainEventBusService)
      .useValue(domainEventBusServiceMock)
      .compile();
    createFieldHandler = module.get(CreateFieldHandler);
    domainEventBusService = module.get(DomainEventBusService);
    fieldRepository = module.get(INJECT_FIELD_REPOSITORY_KEY);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createField', () => {
    it('should be defined', () => {
      expect(createFieldHandler).toBeDefined();
    });

    it('should return successfully with correct data', async () => {
      jest.spyOn(fieldRepository, 'save').mockResolvedValue();
      jest.spyOn(domainEventBusService, 'publishAll').mockResolvedValue(undefined);
      const createFieldPromise = await createFieldHandler.execute(createFieldCommand);

      expect(fieldRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(domainEventBusServiceMock.publishAll).toHaveBeenCalledTimes(1);
      expect(createFieldPromise.isSuccess).toBeTruthy();
    });

    it('should throw error when field already exists', async () => {
      jest
        .spyOn(fieldRepository, 'getByTenantContextKey')
        .mockResolvedValue(singleSelectFieldEntityStub);
      const createFieldPromise = await createFieldHandler.execute(createFieldCommand);
      expect(createFieldPromise.isFailure).toBeTruthy();
      expect(createFieldPromise.getErrorValue()).toStrictEqual(
        FieldAlreadyExistsException.create({
          organizationId: createFieldCommand.organizationId,
          context: createFieldCommand.context,
          key: createFieldCommand.key,
        }),
      );
    });

    it('should return error when required params are empty', async () => {
      createFieldCommand.context = undefined as unknown as string;
      const createFieldPromise = await createFieldHandler.execute(createFieldCommand);

      expect(createFieldPromise.isFailure).toBeTruthy();
      expect(createFieldPromise.getErrorValue()).toStrictEqual(
        ArgumentNullOrUndefinedException.create('context'),
      );
    });
  });
});
