import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TenantContext } from '../../../domain/tenant-context/tenant-context';

export const Tenant = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): TenantContext => {
    const request = ctx.switchToHttp().getRequest();

    const tenantId = request.headers['x-tenant-id'];
    const organizationId = request.headers['x-org-id'];

    return TenantContext.create(tenantId, organizationId);
  },
);
