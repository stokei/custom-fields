import { FieldTypeEnum } from '../../value-objects/field-type.vo';
import {
  FieldValueValidatorBase,
  FieldValueValidatorBaseValidateParams,
  FieldValueValidatorBaseValidateResponse,
} from './base/field-value-validator.base';
import { CheckboxFieldValueValidator } from './validators/checkbox-field-value.validator';
import { MultiSelectFieldValueValidator } from './validators/multi-select-field-value.validator';
import { MultiUploadFieldValueValidator } from './validators/multi-upload-field-value.validator';
import { RadioFieldValueValidator } from './validators/radio-field-value.validator';
import { SingleSelectFieldValueValidator } from './validators/single-select-field-value.validator';
import { SingleUploadFieldValueValidator } from './validators/single-upload-field-value.validator';
import { TextFieldValueValidator } from './validators/text-field-value.validator';
import { TextareaFieldValueValidator } from './validators/textarea-field-value.validator';

export class FieldValueValidatorFactory {
  static validate(
    params: FieldValueValidatorBaseValidateParams,
  ): FieldValueValidatorBaseValidateResponse {
    const type = params.field.type.value;

    const validators: Record<FieldTypeEnum, FieldValueValidatorBase['validate']> = {
      [FieldTypeEnum.TEXT]: (params) => new TextFieldValueValidator().validate(params),
      [FieldTypeEnum.TEXTAREA]: (params) => new TextareaFieldValueValidator().validate(params),
      [FieldTypeEnum.CHECKBOX]: (params) => new CheckboxFieldValueValidator().validate(params),
      [FieldTypeEnum.RADIO]: (params) => new RadioFieldValueValidator().validate(params),
      [FieldTypeEnum.SINGLE_UPLOAD]: (params) =>
        new SingleUploadFieldValueValidator().validate(params),
      [FieldTypeEnum.MULTI_UPLOAD]: (params) =>
        new MultiUploadFieldValueValidator().validate(params),
      [FieldTypeEnum.SINGLE_SELECT]: (params) =>
        new SingleSelectFieldValueValidator().validate(params),
      [FieldTypeEnum.MULTI_SELECT]: (params) =>
        new MultiSelectFieldValueValidator().validate(params),
    };

    return validators?.[type]?.(params);
  }
}
