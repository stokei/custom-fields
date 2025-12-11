import { DomainException } from '@/shared/domain/errors/base/domain-exception';
import { ExceptionCode } from '@/shared/domain/errors/base/exception-codes';

import { FieldTypeValueObject } from '../value-objects/field-type.vo';

export class FieldOptionsIsNotAllowedException extends DomainException {
  private constructor(fieldKey: string, fieldType: string) {
    super(
      `Field "${fieldKey}" of type "${fieldType}" does not allow options.`,
      ExceptionCode.FIELD_OPTIONS_NOT_ALLOWED,
      [
        {
          allowedTypes: FieldTypeValueObject.TYPES_WITH_OPTIONS,
        },
      ],
    );
  }

  static create(fieldKey: string, fieldType: string): FieldOptionsIsNotAllowedException {
    return new FieldOptionsIsNotAllowedException(fieldKey, fieldType);
  }
}
