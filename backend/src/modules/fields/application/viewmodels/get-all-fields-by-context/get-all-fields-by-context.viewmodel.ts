import { ApiProperty } from '@nestjs/swagger';

import { FieldEntity } from '@/modules/fields/domain/entities/field.entity';
import { BaseViewModel } from '@/shared/application/base/viewmodel-base';

import { FieldViewModel } from './field.viewmodel';
import { GroupViewModel } from './group.viewmodel';

interface GetAllFieldsByContextViewModelParams {
  readonly context: string;
  readonly groups: GroupViewModel[];
}
export class GetAllFieldsByContextViewModel extends BaseViewModel {
  @ApiProperty()
  readonly context: string;

  @ApiProperty({ type: [GroupViewModel] })
  readonly groups: GroupViewModel[];

  private constructor(data: GetAllFieldsByContextViewModelParams) {
    super();
    this.context = data.context;
    this.groups = data.groups;
  }

  static create(context: string, fields: FieldEntity[]) {
    const groupsMap = new Map<string, FieldEntity[]>();

    for (const field of fields) {
      const groupName = field.group;
      if (!groupsMap.has(groupName)) {
        groupsMap.set(groupName, []);
      }
      groupsMap.get(groupName)!.push(field);
    }

    const groups: GroupViewModel[] = Array.from(groupsMap.entries()).map(
      ([groupName, groupFields], groupOrder) => {
        return GroupViewModel.create({
          group: groupName,
          order: groupOrder,
          fields: groupFields.map((field) => FieldViewModel.create(field)),
        });
      },
    );
    return new GetAllFieldsByContextViewModel({
      context,
      groups,
    });
  }

  toJSON() {
    return {
      context: this.context,
      groups: this.groups.map((group) => group.toJSON()),
    };
  }
}
