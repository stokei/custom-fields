import { API_KEY_VERIFIER } from '@/shared/domain/ports/api-key-verifier.port';
import { Provider } from '@nestjs/common';
import { UnkeyApiKeyVerifier } from './unkey/unkey-api-key-verifier.service';
import { EnvironmentType } from '@/environments';
import { createProviderByEnvironment } from '@/utils/providers/create-provider-by-environment';
import { LocalApiKeyVerifier } from './local/local-api-key-verifier.service';

const ApiKeyVerifier = createProviderByEnvironment({
  [EnvironmentType.DEVELOPMENT]: {
    provide: API_KEY_VERIFIER,
    useClass: LocalApiKeyVerifier,
  },
  [EnvironmentType.PRODUCTION]: {
    provide: API_KEY_VERIFIER,
    useClass: UnkeyApiKeyVerifier,
  },
  [EnvironmentType.TEST]: {
    provide: API_KEY_VERIFIER,
    useClass: LocalApiKeyVerifier,
  },
});
export const ApiKeysServices: Provider[] = [ApiKeyVerifier];
