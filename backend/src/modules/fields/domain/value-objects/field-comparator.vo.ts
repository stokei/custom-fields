import { ValueObject } from '@/shared/domain/base/value-object';
import { Guard } from '@/shared/domain/guards/guard';

export enum FieldComparatorEnum {
  EQUALS = 'EQUALS',
  GREATER_THAN = 'GREATER_THAN',
  GREATER_OR_EQUALS_THAN = 'GREATER_OR_EQUALS_THAN',
  LESS_THAN = 'LESS_THAN',
  LESS_OR_EQUALS_THAN = 'LESS_OR_EQUALS_THAN',
}

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
