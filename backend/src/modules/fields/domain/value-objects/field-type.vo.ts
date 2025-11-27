import { ValueObject } from '@/shared/domain/base/value-object';
import { Guard } from '@/shared/domain/guards/guard';
import { FieldType as FieldTypeEnum } from '@prisma/client';

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
    const guard = Guard.isOneOf(upper, Object.values(FieldTypeEnum), 'options');
    if (guard.isFailure) {
      throw guard.getErrorValue();
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
