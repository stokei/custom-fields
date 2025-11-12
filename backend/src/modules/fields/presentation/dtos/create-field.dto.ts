import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsArray,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FieldTypeEnum } from '../../domain/value-objects/field-type.vo';

export class CreateFieldOptionDTO {
  @IsString() @IsNotEmpty() value!: string;
  @IsString() @IsNotEmpty() label!: string;
  @IsOptional() @IsInt() order?: number;
}

export class CreateFieldDTO {
  @IsString() @IsNotEmpty() context!: string;
  @IsString() @IsNotEmpty() key!: string;
  @IsString() @IsNotEmpty() label!: string;

  @IsString()
  @IsEnum(FieldTypeEnum)
  type!: FieldTypeEnum;

  @IsBoolean() required!: boolean;

  @IsOptional() @IsInt() order?: number;
  @IsOptional() @IsString() placeholder?: string;
  @IsOptional() @IsString() group?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFieldOptionDTO)
  options?: CreateFieldOptionDTO[];
}
