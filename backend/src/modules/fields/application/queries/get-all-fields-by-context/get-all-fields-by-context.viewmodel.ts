import { FieldEntity } from '@/modules/fields/domain/entities/field.entity';
import { BaseViewModel } from '@/shared/application/base/viewmodel-base';
import { ApiProperty } from '@nestjs/swagger';

import { FieldOptionValueObject } from '@/modules/fields/domain/value-objects/field-option.vo';

interface FieldOptionViewModelProps {
  value: string;
  label: string;
  order: number;
}

export class FieldOptionViewModel {
  @ApiProperty()
  value: string;

  @ApiProperty()
  label: string;

  @ApiProperty()
  order: number;

  constructor(props: FieldOptionViewModelProps) {
    this.value = props.value;
    this.label = props.label;
    this.order = props.order;
  }

  static fromEntityOption(option: FieldOptionValueObject) {
    return new FieldOptionViewModel({
      value: option.value,
      label: option.label,
      order: option.order,
    });
  }
}

interface FieldViewModelProps {
  id: string;
  key: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  order: number;
  options?: FieldOptionViewModelProps[];
}

export class FieldViewModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  key: string;

  @ApiProperty()
  label: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  required: boolean;

  @ApiProperty({ required: false })
  placeholder?: string;

  @ApiProperty()
  order: number;

  @ApiProperty({ required: false, type: [FieldOptionViewModel] })
  options?: FieldOptionViewModel[];

  constructor(props: FieldViewModelProps) {
    this.id = props.id;
    this.key = props.key;
    this.label = props.label;
    this.type = props.type;
    this.required = props.required;
    this.placeholder = props.placeholder;
    this.order = props.order;
    this.options = props.options?.map((o) => new FieldOptionViewModel(o));
  }

  static fromEntity(field: FieldEntity): FieldViewModel {
    return new FieldViewModel({
      id: field.id,
      key: field.key,
      label: field.label,
      type: field.type.value,
      required: field.required,
      placeholder: field.placeholder,
      order: field.order,
      options: field.options?.map((o) => ({
        value: o.value,
        label: o.label,
        order: o.order,
      })),
    });
  }
}

interface GroupViewModelProps {
  group: string;
  order: number;
  fields: FieldViewModel[];
}

export class GroupViewModel {
  @ApiProperty()
  group: string;

  @ApiProperty()
  order: number;

  @ApiProperty({ type: [FieldViewModel] })
  fields: FieldViewModel[];

  constructor(props: GroupViewModelProps) {
    this.group = props.group;
    this.order = props.order;
    this.fields = props.fields;
  }
}

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
    this.groups = data.groups.map((g) => new GroupViewModel(g));
  }

  static create(context: string, fields: FieldEntity[]) {
    const groupsMap = new Map<string, FieldEntity[]>();

    for (const field of fields) {
      const groupName = field.group ?? 'DEFAULT';

      if (!groupsMap.has(groupName)) {
        groupsMap.set(groupName, []);
      }
      groupsMap.get(groupName)!.push(field);
    }

    const groups: GroupViewModel[] = Array.from(groupsMap.entries())
      .map(([groupName, groupFields]) => {
        const sortedFields = [...groupFields].sort((a, b) => a.order - b.order);

        const fieldViewModels = sortedFields.map((f) => FieldViewModel.fromEntity(f));

        const groupOrder = sortedFields.length > 0 ? sortedFields[0].order : 0;

        return new GroupViewModel({
          group: groupName,
          order: groupOrder,
          fields: fieldViewModels,
        });
      })
      .sort((a, b) => {
        if (a.order === b.order) {
          return a.group.localeCompare(b.group);
        }
        return a.order - b.order;
      });
    return new GetAllFieldsByContextViewModel({
      context,
      groups,
    });
  }

  toJSON() {
    return {
      context: this.context,
      groups: this.groups.map((g) => ({
        group: g.group,
        order: g.order,
        fields: g.fields.map((f) => ({
          id: f.id,
          key: f.key,
          label: f.label,
          type: f.type,
          required: f.required,
          placeholder: f.placeholder,
          order: f.order,
          options: f.options?.map((o) => ({
            value: o.value,
            label: o.label,
            order: o.order,
          })),
        })),
      })),
    };
  }
}
