import { ValueObject } from '@/shared/domain/base/value-object';
import { Guard } from '@/shared/domain/utils/guard';

export interface FieldOptionValueObjectProps {
  value: string;
  label: string;
  order: number;
  active: boolean;
}

export class FieldOptionValueObject extends ValueObject<FieldOptionValueObjectProps> {
  get value() {
    return this.props.value;
  }
  get label() {
    return this.props.label;
  }
  get order() {
    return this.props.order ?? 0;
  }
  get active() {
    return this.props.active;
  }

  static create({ value, label, order, active }: FieldOptionValueObjectProps) {
    Guard.againstEmptyString(value, 'option.value');
    Guard.againstEmptyString(label, 'option.label');
    return new FieldOptionValueObject({
      value,
      label,
      order,
      active: active ?? true,
    });
  }
}
