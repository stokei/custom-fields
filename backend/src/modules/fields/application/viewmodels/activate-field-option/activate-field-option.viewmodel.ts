import { ApiProperty } from '@nestjs/swagger';

import { BaseViewModel } from '@/shared/application/base/viewmodel-base';

interface ActivateFieldOptionViewModelProps {
  readonly value: string;
}
export class ActivateFieldOptionViewModel extends BaseViewModel {
  @ApiProperty()
  readonly value: string;
  private constructor(data: ActivateFieldOptionViewModelProps) {
    super();
    this.value = data.value;
  }

  static create(field: ActivateFieldOptionViewModelProps) {
    return new ActivateFieldOptionViewModel(field);
  }

  toJSON() {
    return {
      value: this.value,
    };
  }
}
