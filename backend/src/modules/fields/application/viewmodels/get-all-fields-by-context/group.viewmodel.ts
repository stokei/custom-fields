import { BaseViewModel } from '@/shared/application/base/viewmodel-base';
import { ApiProperty } from '@nestjs/swagger';
import { FieldViewModel } from './field.viewmodel';

interface GroupViewModelProps {
  group: string;
  order: number;
  fields: FieldViewModel[];
}

export class GroupViewModel extends BaseViewModel {
  @ApiProperty()
  group: string;

  @ApiProperty()
  order: number;

  @ApiProperty({ type: [FieldViewModel] })
  fields: FieldViewModel[];

  private constructor(props: GroupViewModelProps) {
    super();

    this.group = props.group;
    this.order = props.order;
    this.fields = props.fields;
  }
  static create(props: GroupViewModelProps) {
    return new GroupViewModel(props);
  }

  toJSON() {
    return {
      group: this.group,
      order: this.order,
      fields: this.fields.map((field) => field.toJSON()),
    };
  }
}
