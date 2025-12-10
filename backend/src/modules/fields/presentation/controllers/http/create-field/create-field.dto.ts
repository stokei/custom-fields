import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

import { FieldComparatorEnum } from '@/modules/fields/domain/value-objects/field-comparator.vo';
import { FieldTypeEnum } from '@/modules/fields/domain/value-objects/field-type.vo';

export class CreateFieldOptionDTO {
  @ApiProperty({
    description:
      'The raw value of the option. Used internally by the system and stored in the database.',
    example: 'active',
  })
  @IsString()
  @IsNotEmpty()
  value!: string;

  @ApiProperty({
    description: 'The label displayed to users when selecting this option.',
    example: 'Active',
  })
  @IsString()
  @IsNotEmpty()
  label!: string;
}

export class CreateFieldDTO {
  @ApiProperty({
    description: 'A unique identifier for this field within the given context.',
    example: 'status',
  })
  @IsString()
  @IsNotEmpty()
  key!: string;

  @ApiProperty({
    description: 'Human-readable label for the field, displayed in the UI.',
    example: 'Status',
  })
  @IsString()
  @IsNotEmpty()
  label!: string;

  @ApiProperty({
    enum: FieldTypeEnum,
    description: 'Defines the input type of the field.',
    example: FieldTypeEnum.SINGLE_SELECT,
  })
  @IsString()
  @IsEnum(FieldTypeEnum)
  type!: FieldTypeEnum;

  @ApiProperty({
    enum: FieldComparatorEnum,
    description: 'Comparison strategy used when filtering or validating this field.',
    example: FieldComparatorEnum.EQUALS,
  })
  @IsString()
  @IsEnum(FieldComparatorEnum)
  comparator!: FieldComparatorEnum;

  @ApiProperty({
    type: 'boolean',
    description: 'Whether the field is required. If true, the field must be filled by the user.',
    example: true,
  })
  @IsBoolean()
  required!: boolean;

  @ApiPropertyOptional({
    type: 'number',
    description: 'Minimum allowed length for text-based field types.',
    example: 3,
  })
  @IsInt()
  minLength?: number;

  @ApiPropertyOptional({
    type: 'number',
    description: 'Maximum allowed length for text-based field types.',
    example: 255,
  })
  @IsInt()
  maxLength?: number;

  @ApiPropertyOptional({
    description: 'A regex pattern used to validate the field value.',
    example: '^[A-Za-z0-9_]+$',
  })
  @IsString()
  pattern?: string;

  @ApiPropertyOptional({
    description: 'Placeholder text shown inside the field until the user starts typing.',
    example: 'Enter your ID...',
  })
  @IsString()
  placeholder?: string;

  @ApiProperty({
    description: 'Represents a logical grouping/category for the field.',
    example: 'GENERAL',
  })
  @IsString()
  group!: string;

  @ApiProperty({
    type: 'number',
    description: 'The display order of the field in the form.',
    example: 10,
  })
  @IsInt()
  order!: number;

  @ApiProperty({
    type: [CreateFieldOptionDTO],
    description:
      'List of selectable options. Required when the field is of type select/single/multi.',
    example: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFieldOptionDTO)
  options!: CreateFieldOptionDTO[];
}
