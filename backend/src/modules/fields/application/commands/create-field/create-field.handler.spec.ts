import { MainModule } from '@/main.module';
import { FieldTypeEnum } from '@/modules/fields/domain/value-objects/field-type.vo';
import { tenantContextStub } from '@/tests/stubs/http/tenant-context.stub';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateFieldCommand } from './create-field.command';
import { CreateFieldHandler } from './create-field.handler';
import { FieldAlreadyExistsException } from '@/modules/fields/domain/errors/field-already-exists-exception';

const commonCreateFieldCommand = new CreateFieldCommand({
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

describe(CreateFieldHandler.name, () => {
  let createFieldHandler: CreateFieldHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MainModule],
    }).compile();

    createFieldHandler = module.get(CreateFieldHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createField', () => {
    it('should be defined', () => {
      expect(createFieldHandler).toBeDefined();
    });

    it('should return successfully with correct data', async () => {
      const createFieldPromise = await createFieldHandler.execute(
        commonCreateFieldCommand,
      );
      expect(createFieldPromise.isSuccess).toBeTruthy();
    });

    it('should throw error when field already exists', async () => {
      const firstCreateFieldPromise = await createFieldHandler.execute(
        commonCreateFieldCommand,
      );
      const secondCreateFieldPromise = await createFieldHandler.execute(
        commonCreateFieldCommand,
      );
      expect(firstCreateFieldPromise.isSuccess).toBeTruthy();
      expect(secondCreateFieldPromise.isFailure).toBeTruthy();
      expect(secondCreateFieldPromise.getErrorValue()).toStrictEqual(
        FieldAlreadyExistsException.create({
          organizationId: commonCreateFieldCommand.organizationId,
          context: commonCreateFieldCommand.context,
          key: commonCreateFieldCommand.key,
        }),
      );
    });
  });
});
