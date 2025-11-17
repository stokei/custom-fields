import { FieldType as FieldTypeEnum } from '@prisma/client';
import { ValueObject } from '@/shared/domain/base/value-object';
import { ValidationError } from '@/shared/domain/errors/validation-error';

export { FieldTypeEnum };

interface FieldTypeProps {
  value: FieldTypeEnum;
}

export class FieldTypeValueObject extends ValueObject<FieldTypeProps> {
  get value() {
    return this.props.value;
  }

  static create(type: FieldTypeEnum) {
    const upper = type.toUpperCase() as FieldTypeEnum;
    if (!Object.values(FieldTypeEnum).includes(upper)) {
      throw new ValidationError(`Invalid field type: ${type}`);
    }
    return new FieldTypeValueObject({ value: upper });
  }

  isSelect(): boolean {
    return (
      this.value === FieldTypeEnum.SINGLE_SELECT ||
      this.value === FieldTypeEnum.MULTI_SELECT
    );
  }
}
