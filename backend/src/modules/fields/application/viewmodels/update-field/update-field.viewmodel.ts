import { ApiProperty } from '@nestjs/swagger';

import { BaseViewModel } from '@/shared/application/base/viewmodel-base';

interface UpdateFieldViewModelProps {
  readonly id: string;
}
export class UpdateFieldViewModel extends BaseViewModel {
  @ApiProperty()
  readonly id: string;
  private constructor(data: UpdateFieldViewModelProps) {
    super();
    this.id = data.id;
  }

  static create(field: UpdateFieldViewModelProps) {
    return new UpdateFieldViewModel(field);
  }

  toJSON() {
    return {
      id: this.id,
    };
  }
}
