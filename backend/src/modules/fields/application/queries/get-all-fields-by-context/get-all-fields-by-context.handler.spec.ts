import { FieldEntity } from '@/modules/fields/domain/entities/field.entity';
import {
  FieldRepository,
  INJECT_FIELD_REPOSITORY_KEY,
} from '@/modules/fields/domain/repositories/field.repository';
import { ArgumentNullOrUndefinedException } from '@/shared/domain/errors/guards/argument-null-or-undefined-exception';
import { fieldRepositoryMock } from '@/tests/mocks/fields/repositories/field-repository.mock';
import { createTestingModule } from '@/tests/mocks/server/create-testing-module';
import { createSingleSelectFieldEntityStub } from '@/tests/stubs/fields/entities/single-select.stub';
import { createTextFieldEntityStub } from '@/tests/stubs/fields/entities/text.stub';
import { tenantContextStub } from '@/tests/stubs/http/tenant-context.stub';
import { GetAllFieldsByContextHandler } from './get-all-fields-by-context.handler';
import { GetAllFieldsByContextQuery } from './get-all-fields-by-context.query';

const getAllFieldsByContextQuery = new GetAllFieldsByContextQuery({
  ...tenantContextStub,
  context: 'CUSTOMER',
});
describe(GetAllFieldsByContextHandler.name, () => {
  let getAllFieldsByContextHandler: GetAllFieldsByContextHandler;
  let fieldRepository: FieldRepository;

  beforeEach(async () => {
    const module = await createTestingModule()
      .overrideProvider(INJECT_FIELD_REPOSITORY_KEY)
      .useValue(fieldRepositoryMock)
      .compile();
    getAllFieldsByContextHandler = module.get(GetAllFieldsByContextHandler);
    fieldRepository = module.get(INJECT_FIELD_REPOSITORY_KEY);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GetAllFieldsByContext', () => {
    it('should return successfully with correct data', async () => {
      const group1Fields: FieldEntity[] = [
        createTextFieldEntityStub({ group: 'GROUP1' }),
        createSingleSelectFieldEntityStub({ group: 'GROUP1' }),
      ];
      const group2Fields: FieldEntity[] = [createTextFieldEntityStub({ group: 'GROUP2' })];
      jest
        .spyOn(fieldRepository, 'getAllByTenantContext')
        .mockResolvedValue([...group1Fields, ...group2Fields]);

      const getAllFieldsByContextPromise = await getAllFieldsByContextHandler.execute(
        getAllFieldsByContextQuery,
      );

      const getAllFieldsByContextResultValue = getAllFieldsByContextPromise.getValue();
      expect(getAllFieldsByContextResultValue.context).toStrictEqual(
        getAllFieldsByContextQuery.context,
      );
      expect(getAllFieldsByContextResultValue.groups.length).toStrictEqual(2);
      expect(getAllFieldsByContextResultValue.groups[0].fields.length).toStrictEqual(
        group1Fields.length,
      );
      expect(getAllFieldsByContextResultValue.groups[1].fields.length).toStrictEqual(
        group2Fields.length,
      );
      expect(getAllFieldsByContextPromise.isSuccess).toBeTruthy();
    });

    it('should return empty groups when fields not found', async () => {
      jest.spyOn(fieldRepository, 'getAllByTenantContext').mockResolvedValue([]);

      const getAllFieldsByContextPromise = await getAllFieldsByContextHandler.execute(
        getAllFieldsByContextQuery,
      );

      const getAllFieldsByContextResultValue = getAllFieldsByContextPromise.getValue();
      expect(getAllFieldsByContextResultValue.context).toStrictEqual(
        getAllFieldsByContextQuery.context,
      );
      expect(getAllFieldsByContextResultValue.groups.length).toStrictEqual(0);
      expect(getAllFieldsByContextPromise.isSuccess).toBeTruthy();
    });

    it('should return error when required params are empty', async () => {
      jest.spyOn(fieldRepository, 'getAllByTenantContext').mockResolvedValue([]);

      getAllFieldsByContextQuery.context = undefined as unknown as string;
      const getAllFieldsByContextPromise = await getAllFieldsByContextHandler.execute(
        getAllFieldsByContextQuery,
      );

      expect(getAllFieldsByContextPromise.isFailure).toBeTruthy();
      expect(getAllFieldsByContextPromise.getErrorValue()).toStrictEqual(
        ArgumentNullOrUndefinedException.create('context'),
      );
    });
  });
});
