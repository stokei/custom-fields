import { BaseViewModel } from '@/shared/application/base/viewmodel-base';
import { ApiProperty } from '@nestjs/swagger';

interface RemoveFieldViewModelProps {
  readonly id: string;
}
export class RemoveFieldViewModel extends BaseViewModel {
  @ApiProperty()
  readonly id: string;
  private constructor(data: RemoveFieldViewModelProps) {
    super();
    this.id = data.id;
  }

  static create(field: RemoveFieldViewModelProps) {
    return new RemoveFieldViewModel(field);
  }

  toJSON() {
    return {
      id: this.id,
    };
  }
}
