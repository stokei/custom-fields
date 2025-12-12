import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { FieldEntity } from '@/modules/fields/domain/entities/field.entity';
import { FieldOptionValueObject } from '@/modules/fields/domain/value-objects/field-option.vo';
import { FieldTypeEnum } from '@/modules/fields/domain/value-objects/field-type.vo';
import { BaseViewModel } from '@/shared/application/base/viewmodel-base';

import { FieldOptionViewModel } from './field-option.viewmodel';

interface FieldViewModelProps {
  key: string;
  label: string;
  type: FieldTypeEnum;
  required: boolean;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  order: number;
  options?: FieldOptionViewModel[];
}

export class FieldViewModel extends BaseViewModel {
  @ApiProperty()
  key: string;

  @ApiProperty()
  label: string;

  @ApiProperty({ enum: FieldTypeEnum })
  type: FieldTypeEnum;

  @ApiProperty()
  required: boolean;

  @ApiPropertyOptional({ type: 'number' })
  minLength?: number;

  @ApiPropertyOptional({ type: 'number' })
  maxLength?: number;

  @ApiPropertyOptional()
  pattern?: string;

  @ApiPropertyOptional()
  placeholder?: string;

  @ApiProperty()
  order: number;

  @ApiPropertyOptional({ type: [FieldOptionViewModel] })
  options?: FieldOptionViewModel[];

  private constructor(props: FieldViewModelProps) {
    super();

    this.key = props.key;
    this.label = props.label;
    this.type = props.type;
    this.required = props.required;
    this.placeholder = props.placeholder;
    this.minLength = props.minLength;
    this.maxLength = props.maxLength;
    this.pattern = props.pattern;
    this.order = props.order;
    this.options = props.options;
  }

  static create(field: FieldEntity): FieldViewModel {
    return new FieldViewModel({
      key: field.key,
      label: field.label,
      type: field.type.value,
      required: field.required,
      placeholder: field.placeholder,
      minLength: field.minLength,
      maxLength: field.maxLength,
      pattern: field.pattern,
      order: field.order,
      options: field.options?.map((option) =>
        FieldOptionViewModel.create(FieldOptionValueObject.create(option)),
      ),
    });
  }
  toJSON() {
    return {
      key: this.key,
      label: this.label,
      type: this.type,
      required: this.required,
      placeholder: this.placeholder,
      minLength: this.minLength,
      maxLength: this.maxLength,
      pattern: this.pattern,
      order: this.order,
      options: this.options?.map((option) => option.toJSON()),
    };
  }
}
