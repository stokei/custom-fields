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
  filters?: {
    activeOnly?: boolean;
  };
}
export interface FieldRepository {
  create(field: FieldEntity): Promise<void>;
  update(field: FieldEntity): Promise<void>;
  getByTenantContextKey(params: GetByTenantContextKeyParams): Promise<FieldEntity | undefined>;
  getAllByTenantContext(params: GetAllByTenantContextParams): Promise<FieldEntity[]>;
}

export const INJECT_FIELD_REPOSITORY_KEY = 'FieldsModuleFieldRepository';
export const InjectFieldRepository = () => Inject(INJECT_FIELD_REPOSITORY_KEY);
