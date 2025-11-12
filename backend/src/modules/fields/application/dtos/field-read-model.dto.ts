import { FieldTypeEnum } from '../../domain/value-objects/field-type.vo';

export interface FieldOptionReadModel {
  value: string;
  label: string;
  order: number;
  isActive: boolean;
}

export interface FieldReadModel {
  id: string;
  tenantId: string;
  context: string;
  key: string;
  label: string;
  type: FieldTypeEnum;
  required: boolean;
  isActive: boolean;
  version: number;

  order: number | null;
  placeholder: string | null;
  group: string | null;

  options: FieldOptionReadModel[];
  createdAt: Date;
  updatedAt: Date;
}
