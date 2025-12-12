import { ApiProperty } from '@nestjs/swagger';

import { BaseViewModel } from '@/shared/application/base/viewmodel-base';

interface ActivateFieldViewModelProps {
  readonly key: string;
}
export class ActivateFieldViewModel extends BaseViewModel {
  @ApiProperty()
  readonly key: string;
  private constructor(data: ActivateFieldViewModelProps) {
    super();
    this.key = data.key;
  }

  static create(field: ActivateFieldViewModelProps) {
    return new ActivateFieldViewModel(field);
  }

  toJSON() {
    return {
      key: this.key,
    };
  }
}
