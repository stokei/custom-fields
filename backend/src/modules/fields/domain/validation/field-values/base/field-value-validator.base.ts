import { Result } from '@/shared/domain/base/result';

import { FieldEntity } from '../../../entities/field.entity';

export interface FieldValueValidatorBaseValidateParams {
  field: FieldEntity;
  values: string[];
  entityId: string;
}
export type FieldValueValidatorBaseValidateResponse = Result<any>;
export interface FieldValueValidatorBase {
  validate(params: FieldValueValidatorBaseValidateParams): FieldValueValidatorBaseValidateResponse;
}
