import { ApiProperty } from '@nestjs/swagger';

import { BaseViewModel } from '@/shared/application/base/viewmodel-base';

interface CreateFieldViewModelProps {
  readonly key: string;
}
export class CreateFieldViewModel extends BaseViewModel {
  @ApiProperty()
  readonly key: string;
  private constructor(data: CreateFieldViewModelProps) {
    super();
    this.key = data.key;
  }

  static create(field: CreateFieldViewModelProps) {
    return new CreateFieldViewModel(field);
  }

  toJSON() {
    return {
      key: this.key,
    };
  }
}
