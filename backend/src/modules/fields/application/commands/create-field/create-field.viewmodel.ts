import { FieldEntity } from '@/modules/fields/domain/entities/field.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFieldViewModel {
  @ApiProperty()
  readonly id: string;
  private constructor(field: FieldEntity) {
    this.id = field.id;
  }

  static create(field: FieldEntity) {
    return new CreateFieldViewModel(field);
  }
}
