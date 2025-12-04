import { BaseViewModel } from '@/shared/application/base/viewmodel-base';
import { ApiProperty } from '@nestjs/swagger';

import { FieldOptionValueObject } from '@/modules/fields/domain/value-objects/field-option.vo';

interface FieldOptionViewModelProps {
  value: string;
  label: string;
  order: number;
}

export class FieldOptionViewModel extends BaseViewModel {
  @ApiProperty()
  value: string;

  @ApiProperty()
  label: string;

  @ApiProperty()
  order: number;

  private constructor(props: FieldOptionViewModelProps) {
    super();
    this.value = props.value;
    this.label = props.label;
    this.order = props.order;
  }

  static create(option: FieldOptionValueObject) {
    return new FieldOptionViewModel({
      value: option.value,
      label: option.label,
      order: option.order,
    });
  }

  toJSON() {
    return {
      value: this.value,
      label: this.label,
      order: this.order,
    };
  }
}
