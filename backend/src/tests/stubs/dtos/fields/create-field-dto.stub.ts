import { CreateFieldDTO } from '@/modules/fields/presentation/dtos/create-field.dto';
import { FieldTypeEnum } from '@/modules/fields/domain/value-objects/field-type.vo';

/*

criar para todos tipos 

*/
export const createFieldDTOStub = (
  overrides: Partial<CreateFieldDTO> = {},
): CreateFieldDTO => ({
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
    { value: 'active', label: 'Ativo', order: 1 },
    { value: 'inactive', label: 'Inativo', order: 2 },
  ],
  ...overrides,
});
