import { FieldOptionValueObjectProps } from '../../domain/value-objects/field-option.vo';
import { FieldTypeEnum } from '../../domain/value-objects/field-type.vo';

export interface CreateFieldDTO {
  tenantId: string;
  context: string;
  key: string;
  label: string;
  type: FieldTypeEnum;
  required: boolean;
  minLength: number | null;
  maxLength: number | null;
  pattern: string | null;
  placeholder: string | null;
  group: string | null;
  order: number | null;
  active: boolean;
  options: FieldOptionValueObjectProps[];
}
