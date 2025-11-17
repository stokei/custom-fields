import { Inject } from '@nestjs/common';
import { FieldEntity } from '../entities/field.entity';

export interface GetByTenantContextKeyParams {
  tenantId: string;
  context: string;
  key: string;
}
export interface FieldRepository {
  create(field: FieldEntity): Promise<void>;
  update(field: FieldEntity): Promise<void>;
  getByTenantContextKey(
    params: GetByTenantContextKeyParams,
  ): Promise<FieldEntity | null>;
}

export const INJECT_FIELD_REPOSITORY_KEY = 'FieldRepository';
export const InjectFieldRepository = () => Inject(INJECT_FIELD_REPOSITORY_KEY);
