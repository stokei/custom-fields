import { Result } from '@/shared/domain/base/result';
import { Guard } from '@/shared/domain/guards/guard';

import {
  FieldValueValidatorBase,
  FieldValueValidatorBaseValidateParams,
  FieldValueValidatorBaseValidateResponse,
} from '../base/field-value-validator.base';

export class TextareaFieldValueValidator implements FieldValueValidatorBase {
  validate(params: FieldValueValidatorBaseValidateParams): FieldValueValidatorBaseValidateResponse {
    const { field, values } = params;
    const value = values[0] ?? '';

    if (field.required) {
      const result = Guard.againstEmptyString(field.key, value);
      if (result.isFailure) {
        return result;
      }
    }
    if (values.length) {
      const result = Guard.arrayMaxLength(field.key, values, 1);
      if (result.isFailure) {
        return result;
      }
    }
    if (field.minLength != null) {
      const result = Guard.againstAtLeast(field.key, field.minLength, value);
      if (result.isFailure) {
        return result;
      }
    }
    if (field.maxLength != null) {
      const result = Guard.againstAtMost(field.key, field.maxLength, value);
      if (result.isFailure) {
        return result;
      }
    }
    if (field.pattern) {
      const result = Guard.matchRegex(field.key, value, field.pattern);
      if (result.isFailure) {
        return result;
      }
    }
    return Result.ok();
  }
}
