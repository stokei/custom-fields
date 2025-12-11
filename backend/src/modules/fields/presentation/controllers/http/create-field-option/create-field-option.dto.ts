import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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
