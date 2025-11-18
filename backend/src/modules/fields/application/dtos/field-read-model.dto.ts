import { FieldTypeEnum } from '../../domain/value-objects/field-type.vo';

export interface FieldOptionReadModel {
  value: string;
  label: string;
  order: number;
  active: boolean;
}

export interface FieldReadModel {
  id: string;
  context: string;
  key: string;
  label: string;
  type: FieldTypeEnum;
  required: boolean;
  minLength: number | undefined;
  maxLength: number | undefined;
  pattern: string | undefined;
  placeholder: string | undefined;
  createdAt: string;
  updatedAt: string;
  order: number;
  active: boolean;
  options: FieldOptionReadModel[];
}
