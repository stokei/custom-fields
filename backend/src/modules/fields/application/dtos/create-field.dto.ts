import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FieldTypeEnum } from '../../domain/value-objects/field-type.vo';

export class CreateFieldOptionDTO {
  @ApiProperty()
  value: string;
  @ApiProperty()
  label: string;
}
export class CreateFieldDTO {
  @ApiProperty()
  tenantId: string;
  @ApiProperty()
  organizationId: string;
  @ApiProperty()
  context: string;
  @ApiProperty()
  key: string;
  @ApiProperty()
  label: string;
  @ApiProperty({ enum: FieldTypeEnum })
  type: FieldTypeEnum;
  @ApiProperty()
  required: boolean;
  @ApiPropertyOptional()
  minLength?: number;
  @ApiPropertyOptional()
  maxLength?: number;
  @ApiPropertyOptional()
  pattern?: string;
  @ApiPropertyOptional()
  placeholder?: string;
  @ApiProperty()
  group: string;
  @ApiProperty({ type: 'number' })
  order: number;
  @ApiProperty({ type: 'boolean' })
  active: boolean;
  @ApiProperty({ type: CreateFieldOptionDTO })
  options: CreateFieldOptionDTO[];
}
