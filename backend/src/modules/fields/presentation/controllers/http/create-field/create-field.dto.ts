import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { FieldTypeEnum } from '../../../../domain/value-objects/field-type.vo';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFieldOptionDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  value!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  label!: string;
}

export class CreateFieldDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  context!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  key!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  label!: string;

  @ApiProperty({ enum: FieldTypeEnum })
  @IsString()
  @IsEnum(FieldTypeEnum)
  type!: FieldTypeEnum;

  @ApiProperty({ type: 'boolean' })
  @IsBoolean()
  required!: boolean;

  @ApiPropertyOptional({ type: 'number' })
  @IsOptional()
  @IsInt()
  minLength?: number;

  @ApiPropertyOptional({ type: 'number' })
  @IsOptional()
  @IsInt()
  maxLength?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pattern?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  placeholder?: string;

  @ApiProperty()
  @IsString()
  group: string;

  @ApiProperty({ type: 'number' })
  @IsInt()
  order: number;

  @ApiProperty({ type: [CreateFieldOptionDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFieldOptionDTO)
  options: CreateFieldOptionDTO[];
}
