import { TenantContext } from '@/shared/domain/tenant-context/tenant-context';

export const tenantContextStub = TenantContext.create(
  'mytenant-id',
  'myorganization-id',
);
