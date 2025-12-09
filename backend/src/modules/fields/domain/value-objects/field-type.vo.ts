import { ValueObject } from '@/shared/domain/base/value-object';
import { Guard } from '@/shared/domain/guards/guard';

export enum FieldTypeEnum {
  TEXT = 'TEXT',
  TEXTAREA = 'TEXTAREA',
  CHECKBOX = 'CHECKBOX',
  RADIO = 'RADIO',
  SINGLE_UPLOAD = 'SINGLE_UPLOAD',
  MULTI_UPLOAD = 'MULTI_UPLOAD',
  SINGLE_SELECT = 'SINGLE_SELECT',
  MULTI_SELECT = 'MULTI_SELECT',
}

interface FieldTypeProps {
  value: FieldTypeEnum;
}

export class FieldTypeValueObject extends ValueObject<FieldTypeProps> {
  public static readonly TYPES_WITH_OPTIONS: FieldTypeEnum[] = [
    FieldTypeEnum.CHECKBOX,
    FieldTypeEnum.RADIO,
    FieldTypeEnum.SINGLE_SELECT,
    FieldTypeEnum.MULTI_SELECT,
  ];

  get value() {
    return this.props.value;
  }

  get hasOptions(): boolean {
    return FieldTypeValueObject.TYPES_WITH_OPTIONS.includes(this.value);
  }

  static create(type: FieldTypeEnum) {
    const upper = type.toUpperCase() as FieldTypeEnum;
    const guard = Guard.isOneOf('options', upper, Object.values(FieldTypeEnum));
    if (guard.isFailure) {
      throw guard.getErrorValue();
    }
    return new FieldTypeValueObject({ value: upper });
  }
}
