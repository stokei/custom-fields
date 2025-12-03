import { Guard } from '@/shared/domain/guards/guard';
import {
  ApiKeyVerifier,
  InjectApiKeyVerifier,
} from '@/shared/domain/ports/api-key-verifier.port';
import { TenantContext } from '@/shared/domain/tenant-context/tenant-context';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InvalidApiKeyException } from '../errors/invalid-api-key-exception';
import {
  APIKEY_HEADER_NAME,
  ORGANIZATION_ID_HEADER_NAME,
} from '@/constants/rest-headers';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    @InjectApiKeyVerifier()
    private readonly apiKeyVerifier: ApiKeyVerifier,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp();
    const request = http.getRequest();

    const apiKey = request.headers[APIKEY_HEADER_NAME];
    const organizationId = request.headers[ORGANIZATION_ID_HEADER_NAME];
    const guardResult = Guard.combine([
      Guard.againstNullOrUndefined(APIKEY_HEADER_NAME, apiKey),
      Guard.againstNullOrUndefined(ORGANIZATION_ID_HEADER_NAME, organizationId),
    ]);
    if (guardResult.isFailure) {
      throw guardResult.getErrorValue();
    }

    const verification = await this.apiKeyVerifier.verify(apiKey);
    if (!verification.valid) {
      throw InvalidApiKeyException.create();
    }

    const tenantId = verification?.tenantId || '';
    request.tenant = TenantContext.create(apiKey, tenantId, organizationId);
    return true;
  }
}
