import { ApiProperty } from '@nestjs/swagger';

import { BaseViewModel } from '@/shared/application/base/viewmodel-base';

interface UpdateFieldOptionViewModelProps {
  readonly value: string;
}
export class UpdateFieldOptionViewModel extends BaseViewModel {
  @ApiProperty()
  readonly value: string;
  private constructor(data: UpdateFieldOptionViewModelProps) {
    super();
    this.value = data.value;
  }

  static create(field: UpdateFieldOptionViewModelProps) {
    return new UpdateFieldOptionViewModel(field);
  }

  toJSON() {
    return {
      value: this.value,
    };
  }
}
