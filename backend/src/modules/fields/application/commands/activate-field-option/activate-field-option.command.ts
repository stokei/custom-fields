import { CommandBase } from '@/shared/application/base/command-base';

interface FieldDTO {
  tenantId: string;
  organizationId: string;
  context: string;
  key: string;
}
interface FieldOptionDTO {
  value: string;
}
interface ActivateFieldOptionDTO {
  field: FieldDTO;
  option: FieldOptionDTO;
}

export class ActivateFieldOptionCommand implements CommandBase, ActivateFieldOptionDTO {
  field: FieldDTO;
  option: FieldOptionDTO;

  constructor(data: ActivateFieldOptionDTO) {
    this.field = {
      tenantId: data.field.tenantId,
      organizationId: data.field.organizationId,
      context: data.field.context,
      key: data.field.key,
    };
    this.option = {
      value: data.option.value,
    };
  }
}
