import { BadRequestException } from '@nestjs/common';

export class TenantContext {
  private constructor(
    public readonly tenantId: string,
    public readonly organizationId: string,
  ) { }

  static create(tenantId: string, organizationId: string) {
    if (!tenantId?.trim?.()?.length) {
      throw new BadRequestException('tenantId is required');
    }
    if (!organizationId?.trim?.()?.length) {
      throw new BadRequestException('organizationId is required');
    }
    return new TenantContext(tenantId, organizationId);
  }
}
