import { UNKEY_ROOT_KEY } from '@/environments';
import {
  ApiKeyVerificationResult,
  ApiKeyVerifier,
} from '@/shared/domain/ports/api-key-verifier.port';
import { Injectable } from '@nestjs/common';
import { Unkey } from '@unkey/api';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class UnkeyApiKeyVerifier implements ApiKeyVerifier {
  private readonly client: Unkey;

  constructor(private readonly loggerService: LoggerService) {
    this.client = new Unkey({
      rootKey: UNKEY_ROOT_KEY,
    });
  }

  async verify(apiKey: string): Promise<ApiKeyVerificationResult> {
    try {
      const response = await this.client.keys.verifyKey({
        key: apiKey,
      });
      if (!response?.data?.valid) {
        return { valid: false };
      }
      const tenantId = response?.data?.meta?.tenantId;
      if (!tenantId || typeof tenantId !== 'string') {
        return { valid: false };
      }
      return {
        valid: true,
        tenantId,
      };
    } catch (error) {
      this.loggerService.error(UnkeyApiKeyVerifier.name, error?.message);
      return {
        valid: false,
      };
    }
  }
}
