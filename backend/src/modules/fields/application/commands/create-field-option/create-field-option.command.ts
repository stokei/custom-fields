import { CommandBase } from '@/shared/application/base/command-base';

interface FieldDTO {
  tenantId: string;
  organizationId: string;
  context: string;
  key: string;
}
interface FieldOptionDTO {
  value: string;
  label: string;
}
interface CreateFieldOptionDTO {
  field: FieldDTO;
  option: FieldOptionDTO;
}

export class CreateFieldOptionCommand implements CommandBase, CreateFieldOptionDTO {
  option: FieldOptionDTO;
  field: FieldDTO;

  constructor(data: CreateFieldOptionDTO) {
    this.field = {
      tenantId: data.field.tenantId,
      organizationId: data.field.organizationId,
      context: data.field.context,
      key: data.field.key,
    };
    this.option = {
      value: data.option.value,
      label: data.option.label,
    };
  }
}
