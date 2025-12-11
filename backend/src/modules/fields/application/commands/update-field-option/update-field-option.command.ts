import { CommandBase } from '@/shared/application/base/command-base';

interface UpdateFieldOptionDTO {
  field: {
    tenantId: string;
    organizationId: string;
    context: string;
    key: string;
  };
  option: {
    where: {
      value: string;
    };
    data: {
      label?: string;
    };
  };
}

export class UpdateFieldOptionCommand implements CommandBase, UpdateFieldOptionDTO {
  public field: {
    tenantId: string;
    organizationId: string;
    context: string;
    key: string;
  };
  public option: {
    where: {
      value: string;
    };
    data: {
      label?: string;
    };
  };

  constructor(params: UpdateFieldOptionDTO) {
    this.field = {
      tenantId: params.field.tenantId,
      organizationId: params.field.organizationId,
      context: params.field.context,
      key: params.field.key,
    };
    this.option = {
      where: {
        value: params.option.where.value,
      },
      data: {
        label: params.option.data.label,
      },
    };
  }
}
