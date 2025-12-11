import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateFieldOptionDTO {
  @ApiPropertyOptional({
    description:
      'New label for the field option. If not provided, the current label remains unchanged.',
    example: 'User Status',
  })
  @IsString()
  label?: string;
}
