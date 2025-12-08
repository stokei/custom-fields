import { Provider } from '@nestjs/common';
import { INJECT_FIELD_REPOSITORY_KEY } from '../../domain/repositories/field.repository';
import { PrismaFieldRepository } from './prisma-field.repository';

export const Repositories: Provider[] = [
  {
    provide: INJECT_FIELD_REPOSITORY_KEY,
    useClass: PrismaFieldRepository,
  },
];
