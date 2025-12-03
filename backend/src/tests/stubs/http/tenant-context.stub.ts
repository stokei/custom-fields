import { TenantContext } from '@/shared/domain/tenant-context/tenant-context';

export const tenantContextStub = TenantContext.create(
  'apikey-mocked',
  'mytenant-id',
  'myorganization-id',
);
