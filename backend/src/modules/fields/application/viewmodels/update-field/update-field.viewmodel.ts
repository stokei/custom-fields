import { ApiProperty } from '@nestjs/swagger';

import { BaseViewModel } from '@/shared/application/base/viewmodel-base';

interface UpdateFieldViewModelProps {
  readonly key: string;
}
export class UpdateFieldViewModel extends BaseViewModel {
  @ApiProperty()
  readonly key: string;
  private constructor(data: UpdateFieldViewModelProps) {
    super();
    this.key = data.key;
  }

  static create(field: UpdateFieldViewModelProps) {
    return new UpdateFieldViewModel(field);
  }

  toJSON() {
    return {
      key: this.key,
    };
  }
}
