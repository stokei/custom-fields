import { CommandBase } from '@/shared/application/base/command-base';

interface UpdateFieldDTO {
  where: {
    tenantId: string;
    organizationId: string;
    context: string;
    key: string;
  };
  data: {
    label?: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    placeholder?: string;
    group?: string;
    order?: number;
  };
}

export class UpdateFieldCommand implements CommandBase, UpdateFieldDTO {
  where: {
    tenantId: string;
    organizationId: string;
    context: string;
    key: string;
  };
  data: {
    label?: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    placeholder?: string;
    group?: string;
    order?: number;
  };

  constructor(data: UpdateFieldDTO) {
    this.where = {
      tenantId: data.where.tenantId,
      organizationId: data.where.organizationId,
      context: data.where.context,
      key: data.where.key,
    };
    this.data = {
      label: data.data.label,
      required: data.data.required,
      minLength: data.data.minLength,
      maxLength: data.data.maxLength,
      pattern: data.data.pattern,
      placeholder: data.data.placeholder,
      group: data.data.group,
      order: data.data.order,
    };
  }
}
