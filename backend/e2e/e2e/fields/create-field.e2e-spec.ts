import { REST_CONTROLLERS_URL_NAMES } from '@/constants/rest-controllers';
import { createRequestTesting } from '@/e2e/stubs/create-request-testing';
import {
  AppTesting,
  createAppTesting,
} from '@/e2e/stubs/create-testing-module';
import { FieldTypeEnum } from '@/modules/fields/domain/value-objects/field-type.vo';
import { CreateFieldDTO } from '@/modules/fields/presentation/dtos/create-field.dto';
import { tenantContextStub } from '@/tests/stubs/http/tenant-context.stub';
import { HttpStatus } from '@nestjs/common';

const data: CreateFieldDTO = {
  ...tenantContextStub,
  context: 'CUSTOMER',
  group: 'GENERAL',
  key: 'status',
  label: 'Status',
  type: FieldTypeEnum.SINGLE_SELECT,
  required: true,
  minLength: undefined,
  maxLength: undefined,
  pattern: undefined,
  placeholder: 'Selecione um status',
  order: 10,
  options: [
    { value: 'active', label: 'Ativo' },
    { value: 'inactive', label: 'Inativo' },
  ],
};

describe('CreateField', () => {
  let app: AppTesting;

  beforeEach(async () => {
    app = await createAppTesting();
  });

  it(`${REST_CONTROLLERS_URL_NAMES.FIELDS.CREATE_FIELD} (POST) - OK`, () => {
    return createRequestTesting(app)
      .post(REST_CONTROLLERS_URL_NAMES.FIELDS.CREATE_FIELD)
      .send(data)
      .expect(HttpStatus.CREATED);
  });
});
