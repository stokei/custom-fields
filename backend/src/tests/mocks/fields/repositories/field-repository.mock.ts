import { FieldRepository } from '@/modules/fields/domain/repositories/field.repository';

const repositoryMock: jest.Mocked<FieldRepository> = {
  getAllByTenantContext: jest.fn(),
  getByTenantContextKey: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};
export const fieldRepositoryMock: jest.Mocked<Partial<FieldRepository>> = repositoryMock;
