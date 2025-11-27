import {
  ApiKeyVerificationResult,
  ApiKeyVerifier,
} from '@/shared/domain/ports/api-key-verifier.port';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LocalApiKeyVerifier implements ApiKeyVerifier {
  async verify(apiKey: string): Promise<ApiKeyVerificationResult> {
    if (!apiKey) {
      return { valid: false };
    }
    const tenantId = 'my-tenant-id';
    return {
      valid: true,
      tenantId,
    };
  }
}
