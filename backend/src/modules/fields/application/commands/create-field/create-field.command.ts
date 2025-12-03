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
  readonly tenantId: string;
  readonly organizationId: string;
  readonly context: string;
  readonly key: string;
  readonly label: string;
  readonly type: FieldTypeEnum;
  readonly required: boolean;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly pattern?: string;
  readonly placeholder?: string;
  readonly group: string;
  readonly order: number;
  readonly options: FieldOptionValueObjectProps[];

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
