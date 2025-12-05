import { FieldRepository } from '@/modules/fields/domain/repositories/field.repository';

export const fieldRepositoryMock: jest.Mocked<Partial<FieldRepository>> = {
  getAllByTenantContext: jest.fn(),
  getByTenantContextKey: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};
