import { ArgumentEmptyArrayException } from '@/shared/domain/errors/guards/argument-empty-array-exception';
import { ValueNotOneOfException } from '@/shared/domain/errors/guards/value-not-one-of-exception';
import { createMultiSelectFieldEntityStub } from '@/tests/stubs/fields/entities/multi-select.stub';

import { FieldEntity } from '../../../entities/field.entity';
import { MultiSelectFieldValueValidator } from './multi-select-field-value.validator';

const entityId = 'user-uuid';
describe(MultiSelectFieldValueValidator.name, () => {
  let fieldEntityStub: FieldEntity;
  let validator: MultiSelectFieldValueValidator;

  beforeEach(() => {
    validator = new MultiSelectFieldValueValidator();
    fieldEntityStub = createMultiSelectFieldEntityStub();
  });

  it('should return failure if field is required and values array is empty', () => {
    fieldEntityStub = createMultiSelectFieldEntityStub({ required: true });

    const result = validator.validate({ field: fieldEntityStub, entityId, values: [] });

    expect(result.isFailure).toBeTruthy();
    expect(result.getErrorValue() instanceof ArgumentEmptyArrayException).toBeTruthy();
  });

  it('should return ok if values array is empty and field is not required', () => {
    fieldEntityStub = createMultiSelectFieldEntityStub({ required: false });

    const result = validator.validate({ field: fieldEntityStub, entityId, values: [] });
    expect(result.isSuccess).toBeTruthy();
  });

  it('should return failure if any value is not in field options', () => {
    const values = ['opt1', 'opt3'];

    const result = validator.validate({ field: fieldEntityStub, entityId, values });

    expect(result.isFailure).toBeTruthy();
    expect(result.getErrorValue() instanceof ValueNotOneOfException).toBeTruthy();
  });

  it('should return ok if all values are in field options', () => {
    const values = [fieldEntityStub.options[0].value, fieldEntityStub.options[1].value];
    const result = validator.validate({ field: fieldEntityStub, entityId, values });

    expect(result.isSuccess).toBeTruthy();
  });
});
