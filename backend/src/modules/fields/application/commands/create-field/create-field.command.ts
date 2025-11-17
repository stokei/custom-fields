import { FieldTypeEnum } from '@/modules/fields/domain/value-objects/field-type.vo';
import { CreateFieldDTO } from '@/modules/fields/application/dtos/create-field.dto';
import { CommandBase } from '@/shared/application/base/command-base';
import { FieldOptionValueObjectProps } from '@/modules/fields/domain/value-objects/field-option.vo';

export class CreateFieldCommand
  implements CommandBase, Readonly<CreateFieldDTO> {
  readonly tenantId: string;
  readonly context: string;
  readonly key: string;
  readonly label: string;
  readonly type: FieldTypeEnum;
  readonly required: boolean;
  readonly minLength: number | null;
  readonly maxLength: number | null;
  readonly pattern: string | null;
  readonly placeholder: string | null;
  readonly group: string | null;
  readonly order: number | null;
  readonly active: boolean;
  readonly options: FieldOptionValueObjectProps[];

  constructor(data: CreateFieldDTO) {
    this.tenantId = data.tenantId;
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
    this.active = data.active;
    this.options = data.options;
  }
}
