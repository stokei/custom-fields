import { Result } from '@/shared/domain/base/result';
import { Guard } from '@/shared/domain/guards/guard';

import {
  FieldValueValidatorBase,
  FieldValueValidatorBaseValidateParams,
  FieldValueValidatorBaseValidateResponse,
} from '../base/field-value-validator.base';

export class RadioFieldValueValidator implements FieldValueValidatorBase {
  validate(params: FieldValueValidatorBaseValidateParams): FieldValueValidatorBaseValidateResponse {
    const { field, values } = params;

    if (field.required) {
      const result = Guard.againstEmptyArray(field.key, values);
      if (result.isFailure) {
        return result;
      }
    }
    if (!values.length) {
      return Result.ok();
    }
    if (values.length) {
      const result = Guard.arrayMaxLength(field.key, values, 1);
      if (result.isFailure) {
        return result;
      }
    }
    const optionsValues = field.options.map((opt) => opt.value);
    const validateOptions = Guard.combine(
      values.map((value) => Guard.isOneOf(field.key, value, optionsValues)),
    );
    return validateOptions;
  }
}
