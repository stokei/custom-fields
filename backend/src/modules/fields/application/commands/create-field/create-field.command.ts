import { FieldTypeEnum } from '@/modules/fields/domain/value-objects/field-type.vo';
import { CommandBase } from 'src/shared/application/base/command-base';

interface CreateFieldOption {
  value: string;
  label: string;
}

interface CreateFieldCommandParams {
  tenantId: string;
  context: string;
  key: string;
  label: string;
  type: FieldTypeEnum;
  required: boolean;
  options?: CreateFieldOption[];
  order?: number;
  placeholder?: string;
  group?: string;
}

export class CreateFieldCommand implements CommandBase {
  public readonly tenantId: string;
  public readonly context: string;
  public readonly key: string;
  public readonly label: string;
  public readonly type: FieldTypeEnum;
  public readonly required: boolean;
  public readonly options?: CreateFieldOption[];
  public readonly order?: number;
  public readonly placeholder?: string;
  public readonly group?: string;

  constructor(data: CreateFieldCommandParams) {
    this.tenantId = data.tenantId;
    this.context = data.context;
    this.key = data.key;
    this.label = data.label;
    this.type = data.type;
    this.required = data.required;
    this.options = data.options;
    this.order = data.order;
    this.placeholder = data.placeholder;
    this.group = data.group;
  }
}
