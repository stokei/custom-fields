import { ApiProperty } from '@nestjs/swagger';

import { BaseViewModel } from '@/shared/application/base/viewmodel-base';

interface DeactivateFieldViewModelProps {
  readonly key: string;
}
export class DeactivateFieldViewModel extends BaseViewModel {
  @ApiProperty()
  readonly key: string;
  private constructor(data: DeactivateFieldViewModelProps) {
    super();
    this.key = data.key;
  }

  static create(field: DeactivateFieldViewModelProps) {
    return new DeactivateFieldViewModel(field);
  }

  toJSON() {
    return {
      key: this.key,
    };
  }
}
