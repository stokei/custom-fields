import { FieldComparator as FieldComparatorEnum } from '@/database/prisma/prisma-generated-types/client';
import { ValueObject } from '@/shared/domain/base/value-object';
import { Guard } from '@/shared/domain/guards/guard';

export { FieldComparatorEnum };

interface FieldComparatorProps {
  value: FieldComparatorEnum;
}

export class FieldComparatorValueObject extends ValueObject<FieldComparatorProps> {
  get value() {
    return this.props.value;
  }

  static create(type: FieldComparatorEnum) {
    const upper = type.toUpperCase() as FieldComparatorEnum;
    const guard = Guard.isOneOf('options', upper, Object.values(FieldComparatorEnum));
    if (guard.isFailure) {
      throw guard.getErrorValue();
    }
    return new FieldComparatorValueObject({ value: upper });
  }
}
