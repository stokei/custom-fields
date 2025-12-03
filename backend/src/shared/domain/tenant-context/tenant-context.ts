import { Guard } from '../guards/guard';

export class TenantContext {
  private constructor(
    public readonly tenantId: string,
    public readonly organizationId: string,
  ) { }

  static create(tenantId: string, organizationId: string) {
    const guardResult = Guard.combine([
      Guard.againstNullOrUndefined('tenantId', tenantId),
      Guard.againstNullOrUndefined('organizationId', organizationId),
    ]);
    if (guardResult.isFailure) {
      throw guardResult.getErrorValue();
    }
    return new TenantContext(tenantId, organizationId);
  }
}
