import { Provider } from '@nestjs/common';

import { ENVIRONMENT, EnvironmentType } from '@/environments';

export const createProviderByEnvironment = (providers: Record<EnvironmentType, Provider>) => {
  return providers?.[ENVIRONMENT];
};
