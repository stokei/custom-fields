import { ApiProperty } from '@nestjs/swagger';

import { BaseViewModel } from '@/shared/application/base/viewmodel-base';

interface ActivateFieldViewModelProps {
  readonly id: string;
}
export class ActivateFieldViewModel extends BaseViewModel {
  @ApiProperty()
  readonly id: string;
  private constructor(data: ActivateFieldViewModelProps) {
    super();
    this.id = data.id;
  }

  static create(field: ActivateFieldViewModelProps) {
    return new ActivateFieldViewModel(field);
  }

  toJSON() {
    return {
      id: this.id,
    };
  }
}
