import { Inject } from '@nestjs/common';
import { FieldEntity } from '../entities/field.entity';

export interface GetByTenantContextKeyParams {
  tenantId: string;
  organizationId: string;
  context: string;
  key: string;
}
export interface GetAllByTenantContextParams {
  tenantId: string;
  organizationId: string;
  context: string;
}
export interface FieldRepository {
  save(field: FieldEntity): Promise<void>;
  getByTenantContextKey(params: GetByTenantContextKeyParams): Promise<FieldEntity | null>;
  getAllByTenantContext(params: GetAllByTenantContextParams): Promise<FieldEntity[]>;
}

export const INJECT_FIELD_REPOSITORY_KEY = 'FieldRepository';
export const InjectFieldRepository = () => Inject(INJECT_FIELD_REPOSITORY_KEY);
