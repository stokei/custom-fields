import { Guard } from '@/shared/domain/guards/guard';
import {
  ApiKeyVerifier,
  InjectApiKeyVerifier,
} from '@/shared/domain/ports/api-key-verifier.port';
import { TenantContext } from '@/shared/domain/tenant-context/tenant-context';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InvalidApiKeyException } from '../errors/invalid-api-key-exception';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    @InjectApiKeyVerifier()
    private readonly apiKeyVerifier: ApiKeyVerifier,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp();
    const request = http.getRequest();

    const rawApiKey = request.headers['x-api-key'];
    const organizationId = request.headers['x-organization-id'];
    const guardResult = Guard.combine([
      Guard.againstNullOrUndefined('x-api-key', rawApiKey),
      Guard.againstNullOrUndefined('x-organization-id', organizationId),
    ]);
    if (guardResult.isFailure) {
      throw guardResult.getErrorValue();
    }

    const verification = await this.apiKeyVerifier.verify(rawApiKey);
    if (!verification.valid) {
      throw InvalidApiKeyException.create();
    }

    const tenantId = verification?.tenantId || '';
    request.tenant = TenantContext.create(tenantId, organizationId);
    return true;
  }
}
