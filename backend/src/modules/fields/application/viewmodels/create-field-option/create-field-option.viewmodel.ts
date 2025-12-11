import { ApiProperty } from '@nestjs/swagger';

import { BaseViewModel } from '@/shared/application/base/viewmodel-base';

interface CreateFieldOptionViewModelProps {
  readonly value: string;
}
export class CreateFieldOptionViewModel extends BaseViewModel {
  @ApiProperty()
  readonly value: string;
  private constructor(data: CreateFieldOptionViewModelProps) {
    super();
    this.value = data.value;
  }

  static create(field: CreateFieldOptionViewModelProps) {
    return new CreateFieldOptionViewModel(field);
  }

  toJSON() {
    return {
      value: this.value,
    };
  }
}
