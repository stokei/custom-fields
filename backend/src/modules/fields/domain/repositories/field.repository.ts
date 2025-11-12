import { Inject } from '@nestjs/common';
import { FieldReadModel } from '../../application/dtos/field-read-model.dto';
import { FieldEntity } from '../entities/field.entity';

export interface FieldRepository {
  save(field: FieldEntity): Promise<void>;
  findById(id: string): Promise<FieldReadModel | null>;
}

export const InjectFieldRepository = () => Inject('FieldRepository');
