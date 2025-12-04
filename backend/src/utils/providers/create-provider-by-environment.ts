import { ENVIRONMENT, EnvironmentType } from '@/environments';
import { Provider } from '@nestjs/common';

export const createProviderByEnvironment = (providers: Record<EnvironmentType, Provider>) => {
  return providers?.[ENVIRONMENT];
};
