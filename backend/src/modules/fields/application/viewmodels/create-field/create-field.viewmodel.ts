import { BaseViewModel } from '@/shared/application/base/viewmodel-base';
import { ApiProperty } from '@nestjs/swagger';

interface CreateFieldViewModelProps {
  readonly id: string;
}
export class CreateFieldViewModel extends BaseViewModel {
  @ApiProperty()
  readonly id: string;
  private constructor(data: CreateFieldViewModelProps) {
    super();
    this.id = data.id;
  }

  static create(field: CreateFieldViewModelProps) {
    return new CreateFieldViewModel(field);
  }

  toJSON() {
    return {
      id: this.id,
    };
  }
}
