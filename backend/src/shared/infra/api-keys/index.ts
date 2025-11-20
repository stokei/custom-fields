import { API_KEY_VERIFIER } from '@/shared/domain/ports/api-key-verifier.port';
import { Provider } from '@nestjs/common';
import { UnkeyApiKeyVerifier } from './unkey/unkey-api-key-verifier.service';

export const ApiKeysServices: Provider[] = [
  {
    provide: API_KEY_VERIFIER,
    useClass: UnkeyApiKeyVerifier,
  },
];
