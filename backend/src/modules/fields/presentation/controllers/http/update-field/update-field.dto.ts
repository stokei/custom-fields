import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsString } from 'class-validator';

export class UpdateFieldDTO {
  @ApiPropertyOptional({
    description: 'New label for the field. If not provided, the current label remains unchanged.',
    example: 'User Status',
  })
  @IsString()
  label?: string;

  @ApiPropertyOptional({
    type: 'boolean',
    description: 'Defines whether the field becomes required or optional.',
    example: true,
  })
  @IsBoolean()
  required?: boolean;

  @ApiPropertyOptional({
    type: 'number',
    description: 'New minimum length constraint for text-based fields.',
    example: 3,
  })
  @IsInt()
  minLength?: number;

  @ApiPropertyOptional({
    type: 'number',
    description: 'New maximum length constraint for text-based fields.',
    example: 255,
  })
  @IsInt()
  maxLength?: number;

  @ApiPropertyOptional({
    description: 'New regex pattern used to validate the field value.',
    example: '^[A-Za-z0-9_]+$',
  })
  @IsString()
  pattern?: string;

  @ApiPropertyOptional({
    description: 'New placeholder for the field, displayed before the user enters a value.',
    example: 'Type your username...',
  })
  @IsString()
  placeholder?: string;

  @ApiPropertyOptional({
    description: 'Changes the logical group/category of this field.',
    example: 'GENERAL',
  })
  @IsString()
  group?: string;

  @ApiPropertyOptional({
    type: 'number',
    description: 'New display order of the field in the UI.',
    example: 5,
  })
  @IsInt()
  order?: number;
}
