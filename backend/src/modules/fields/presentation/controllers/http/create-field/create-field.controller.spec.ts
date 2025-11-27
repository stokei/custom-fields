import { MainModule } from '@/main.module';
import { CreateFieldCommand } from '@/modules/fields/application/commands/create-field/create-field.command';
import { CreateFieldViewModel } from '@/modules/fields/application/commands/create-field/create-field.viewmodel';
import { UniqueEntityID } from '@/shared/domain/utils/unique-entity-id';
import { CommandBusService } from '@/shared/infra/command-bus/command-bus.service';
import { createFieldDTOStub } from '@/tests/stubs/dtos/fields/create-field-dto.stub';
import { tenantContextStub } from '@/tests/stubs/http/tenant-context.stub';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateFieldController } from './create-field.controller';

describe(CreateFieldController.name, () => {
  let controller: CreateFieldController;
  let commandBusService: jest.Mocked<CommandBusService<CreateFieldCommand>>;

  const mockCreateFieldDTO = createFieldDTOStub();

  const mockFieldViewModel = CreateFieldViewModel.create({
    id: new UniqueEntityID().toString(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MainModule],
    }).compile();

    controller = module.get<CreateFieldController>(CreateFieldController);
    commandBusService = module.get(CommandBusService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createField', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should call commandBusService.execute with correct CreateFieldCommand', async () => {
      await controller.createField(tenantContextStub, mockCreateFieldDTO);

      expect(commandBusService.execute).toHaveBeenCalledTimes(1);
      expect(commandBusService.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          tenantId: tenantContextStub.tenantId,
          organizationId: tenantContextStub.organizationId,
          context: mockCreateFieldDTO.context,
          key: mockCreateFieldDTO.key,
          label: mockCreateFieldDTO.label,
          type: mockCreateFieldDTO.type,
          required: mockCreateFieldDTO.required,
          minLength: mockCreateFieldDTO.minLength,
          maxLength: mockCreateFieldDTO.maxLength,
          placeholder: mockCreateFieldDTO.placeholder,
          group: mockCreateFieldDTO.group,
          order: mockCreateFieldDTO.order,
          active: true,
          options: mockCreateFieldDTO.options,
        }),
      );
    });

    it('should return CreateFieldViewModel on success', async () => {
      const result = await controller.createField(
        tenantContextStub,
        mockCreateFieldDTO,
      );

      expect(result).toEqual(mockFieldViewModel);
      expect(result.id).toBeDefined();
    });

    it('should include tenant information in the command', async () => {
      await controller.createField(tenantContextStub, mockCreateFieldDTO);

      const callArgs = commandBusService.execute.mock.calls[0][0];
      expect(callArgs.tenantId).toBe(tenantContextStub.tenantId);
      expect(callArgs.organizationId).toBe(tenantContextStub.organizationId);
    });
  });
});
