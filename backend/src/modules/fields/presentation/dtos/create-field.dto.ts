import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

import { FieldTypeEnum } from '../../domain/value-objects/field-type.vo';

export class CreateFieldOptionDTO {
  @IsString()
  @IsNotEmpty()
  value!: string;

  @IsString()
  @IsNotEmpty()
  label!: string;

  @IsInt()
  @Min(0)
  @Max(2_147_483_647)
  order: number;
}

export class CreateFieldDTO {
  @IsString()
  @IsNotEmpty()
  context!: string;

  @IsString()
  @IsNotEmpty()
  key!: string;

  @IsString()
  @IsNotEmpty()
  label!: string;

  @IsString()
  @IsEnum(FieldTypeEnum)
  type!: FieldTypeEnum;

  @IsBoolean()
  required!: boolean;

  @IsOptional()
  @IsInt()
  minLength?: number;

  @IsOptional()
  @IsInt()
  maxLength?: number;

  @IsOptional()
  @IsString()
  pattern?: string;

  @IsOptional()
  @IsString()
  placeholder?: string;

  @IsString()
  group: string;

  @IsInt()
  order: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFieldOptionDTO)
  options: CreateFieldOptionDTO[];
}
