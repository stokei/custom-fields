import {
  ApiKeyVerifier,
  InjectApiKeyVerifier,
} from '@/shared/domain/ports/api-key-verifier.port';
import { TenantContext } from '@/shared/domain/tenant-context/tenant-context';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';

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
    if (typeof rawApiKey !== 'string' || rawApiKey.trim().length === 0) {
      throw new BadRequestException('Missing x-api-key header');
    }
    const organizationId = request.headers['x-organization-id'];
    if (
      typeof organizationId !== 'string' ||
      organizationId.trim().length === 0
    ) {
      throw new BadRequestException('Missing x-organization-id header');
    }

    const verification = await this.apiKeyVerifier.verify(rawApiKey);
    if (!verification.valid) {
      throw new BadRequestException('Invalid API key');
    }

    const tenantId = verification?.tenantId || '';
    request.tenant = TenantContext.create(tenantId, organizationId);
    return true;
  }
}
