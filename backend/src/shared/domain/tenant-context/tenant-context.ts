import { Guard } from '../guards/guard';

export class TenantContext {
  private constructor(
    public readonly apiKey: string,
    public readonly tenantId: string,
    public readonly organizationId: string,
  ) {}

  static create(apiKey: string, tenantId: string, organizationId: string) {
    const guardResult = Guard.combine([
      Guard.againstNullOrUndefined('apiKey', apiKey),
      Guard.againstNullOrUndefined('tenantId', tenantId),
      Guard.againstNullOrUndefined('organizationId', organizationId),
    ]);
    if (guardResult.isFailure) {
      throw guardResult.getErrorValue();
    }
    return new TenantContext(apiKey, tenantId, organizationId);
  }
}
