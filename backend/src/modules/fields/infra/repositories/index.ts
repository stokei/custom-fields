import { Provider } from '@nestjs/common';
import { PrismaFieldRepository } from './prisma-field.repository';
import { LocalFieldRepository } from './local-field.repository';
import { INJECT_FIELD_REPOSITORY_KEY } from '../../domain/repositories/field.repository';
import { createProviderByEnvironment } from '@/utils/providers/create-provider-by-environment';
import { EnvironmentType } from '@/environments';

const FieldRepository = createProviderByEnvironment({
  [EnvironmentType.DEVELOPMENT]: {
    provide: INJECT_FIELD_REPOSITORY_KEY,
    useClass: PrismaFieldRepository,
  },
  [EnvironmentType.PRODUCTION]: {
    provide: INJECT_FIELD_REPOSITORY_KEY,
    useClass: PrismaFieldRepository,
  },
  [EnvironmentType.TEST]: {
    provide: INJECT_FIELD_REPOSITORY_KEY,
    useClass: LocalFieldRepository,
  },
});
export const Repositories: Provider[] = [FieldRepository];
