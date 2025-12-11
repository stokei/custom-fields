import { ApiProperty } from '@nestjs/swagger';

import { BaseViewModel } from '@/shared/application/base/viewmodel-base';

interface DeactivateFieldOptionViewModelProps {
  readonly value: string;
}
export class DeactivateFieldOptionViewModel extends BaseViewModel {
  @ApiProperty()
  readonly value: string;
  private constructor(data: DeactivateFieldOptionViewModelProps) {
    super();
    this.value = data.value;
  }

  static create(field: DeactivateFieldOptionViewModelProps) {
    return new DeactivateFieldOptionViewModel(field);
  }

  toJSON() {
    return {
      value: this.value,
    };
  }
}
