import { ApiProperty } from '@nestjs/swagger';

interface CreateFieldViewModelProps {
  readonly id: string;
}
export class CreateFieldViewModel {
  @ApiProperty()
  readonly id: string;
  private constructor(data: CreateFieldViewModelProps) {
    this.id = data.id;
  }

  static create(field: CreateFieldViewModelProps) {
    return new CreateFieldViewModel(field);
  }
}
