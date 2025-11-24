import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TenantContext } from '../../../domain/tenant-context/tenant-context';

export const Tenant = createParamDecorator(
  (
    data: keyof TenantContext,
    ctx: ExecutionContext,
  ): keyof TenantContext | TenantContext => {
    const request = ctx.switchToHttp().getRequest();
    return request?.tenant?.[data] || request?.tenant;
  },
);
