import { ApiProperty } from '@nestjs/swagger';

import { BaseViewModel } from '@/shared/application/base/viewmodel-base';

interface DeactivateFieldViewModelProps {
  readonly id: string;
}
export class DeactivateFieldViewModel extends BaseViewModel {
  @ApiProperty()
  readonly id: string;
  private constructor(data: DeactivateFieldViewModelProps) {
    super();
    this.id = data.id;
  }

  static create(field: DeactivateFieldViewModelProps) {
    return new DeactivateFieldViewModel(field);
  }

  toJSON() {
    return {
      id: this.id,
    };
  }
}
