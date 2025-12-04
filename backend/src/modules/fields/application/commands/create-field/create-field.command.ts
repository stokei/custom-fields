import { FieldTypeEnum } from '@/modules/fields/domain/value-objects/field-type.vo';
import { CommandBase } from '@/shared/application/base/command-base';
import { FieldOptionValueObjectProps } from '@/modules/fields/domain/value-objects/field-option.vo';

interface CreateFieldOptionDTO {
  value: string;
  label: string;
}
interface CreateFieldDTO {
  tenantId: string;
  organizationId: string;
  context: string;
  key: string;
  label: string;
  type: FieldTypeEnum;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  placeholder?: string;
  group: string;
  order: number;
  options: CreateFieldOptionDTO[];
}

export class CreateFieldCommand implements CommandBase, CreateFieldDTO {
  tenantId: string;
  organizationId: string;
  context: string;
  key: string;
  label: string;
  type: FieldTypeEnum;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  placeholder?: string;
  group: string;
  order: number;
  options: FieldOptionValueObjectProps[];

  constructor(data: CreateFieldDTO) {
    this.tenantId = data.tenantId;
    this.organizationId = data.organizationId;
    this.context = data.context;
    this.key = data.key;
    this.label = data.label;
    this.type = data.type;
    this.required = data.required;
    this.minLength = data.minLength;
    this.maxLength = data.maxLength;
    this.pattern = data.pattern;
    this.placeholder = data.placeholder;
    this.group = data.group;
    this.order = data.order;
    this.options = data.options;
  }
}
