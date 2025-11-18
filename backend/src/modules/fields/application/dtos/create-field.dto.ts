import { FieldOptionValueObjectProps } from '../../domain/value-objects/field-option.vo';
import { FieldTypeEnum } from '../../domain/value-objects/field-type.vo';

export interface CreateFieldDTO {
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
  active: boolean;
  options: FieldOptionValueObjectProps[];
}
