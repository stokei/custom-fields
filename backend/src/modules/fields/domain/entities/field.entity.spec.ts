import { ArgumentNullOrUndefinedException } from '@/shared/domain/errors/guards/argument-null-or-undefined-exception';
import { UniqueEntityID } from '@/shared/domain/utils/unique-entity-id';
import { tenantContextStub } from '@/tests/stubs/http/tenant-context.stub';

import { FieldOptionAlreadyExistsException } from '../errors/field-option-already-exists-exception';
import { FieldCreatedEvent } from '../events/field-created/field-created.event';
import { FieldComparatorEnum } from '../value-objects/field-comparator.vo';
import { FieldTypeEnum } from '../value-objects/field-type.vo';
import { CreateFieldInput, FieldEntity } from './field.entity';

const REQUIRED_FIELDS: (keyof FieldEntity)[] = [
  'tenantId',
  'organizationId',
  'context',
  'key',
  'label',
  'group',
  'type',
];
const mountFieldEntityProps = (overrides: Partial<CreateFieldInput> = {}): CreateFieldInput => ({
  ...tenantContextStub,
  context: 'nonconformities',
  key: 'field_key',
  label: 'My Field',
  type: FieldTypeEnum.TEXT,
  comparator: FieldComparatorEnum.EQUALS,
  required: true,
  minLength: 1,
  maxLength: 10,
  pattern: undefined,
  placeholder: 'placeholder',
  group: 'default',
  order: 1,
  active: true,
  options: [],
  createdAt: undefined,
  updatedAt: undefined,
  ...overrides,
});

describe(FieldEntity.name, () => {
  it('should create a new user with default values and trigger FieldCreatedEvent', () => {
    const input = mountFieldEntityProps({
      type: FieldTypeEnum.SINGLE_SELECT,
      options: [
        { value: 'opt-1', label: 'Option 1', order: 0, active: true },
        { value: 'opt-2', label: 'Option 2', order: 1, active: true },
      ],
    });

    const field = FieldEntity.create(input);

    expect(field).toBeInstanceOf(FieldEntity);
    expect(field.id).toBeDefined();
    expect(field.tenantId).toBe(input.tenantId);
    expect(field.organizationId).toBe(input.organizationId);
    expect(field.context).toBe(input.context);
    expect(field.key).toBe(input.key);
    expect(field.label).toBe(input.label);
    expect(field.type.value).toBe(input.type);
    expect(field.required).toBe(true);
    expect(field.group).toBe(input.group);
    expect(field.order).toBe(input.order);
    expect(field.active).toBe(true);
    expect(field.options).toHaveLength(2);
    expect(field.options[0].order).toBe(0);
    expect(field.options[1].order).toBe(1);

    expect(typeof field.createdAt).toBe('string');
    expect(typeof field.updatedAt).toBe('string');
    expect(field.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(field.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);

    expect(field.domainEvents).toHaveLength(1);
    expect(field.domainEvents[0]).toBeInstanceOf(FieldCreatedEvent);

    const eventPayload = (field.domainEvents[0] as FieldCreatedEvent).field;
    expect(eventPayload).toBe(field);
  });

  it('should not trigger FieldCreatedEvent when an id is provided', () => {
    const input = mountFieldEntityProps({
      type: FieldTypeEnum.SINGLE_SELECT,
      options: [{ value: 'opt-1', label: 'Option 1', order: 0, active: true }],
    });

    const id = new UniqueEntityID('fixed-id');
    const field = FieldEntity.create(input, id);

    expect(field.id).toBe('fixed-id');

    expect(field.domainEvents).toHaveLength(0);
  });

  it('should remove options when options are provided to invalid field type', () => {
    const input = mountFieldEntityProps({
      type: FieldTypeEnum.TEXT,
      options: [{ value: 'opt-1', label: 'Option 1', order: 0, active: true }],
    });
    expect(FieldEntity.create(input).options.length).toStrictEqual(0);
  });

  it.each(REQUIRED_FIELDS)(`should throw an error when '%s' are empty`, (fieldKey) => {
    expect(() =>
      FieldEntity.create(
        mountFieldEntityProps({
          [fieldKey]: undefined,
        }),
      ),
    ).toThrow(ArgumentNullOrUndefinedException.create(fieldKey));
  });

  it('should throw an error when options are required and it is not provided', () => {
    const input = mountFieldEntityProps({
      type: FieldTypeEnum.SINGLE_SELECT,
      options: [],
    });
    expect(() => FieldEntity.create(input)).toThrow();
  });

  it('should throw an error when duplicate option value is provided', () => {
    const input = mountFieldEntityProps({
      type: FieldTypeEnum.SINGLE_SELECT,
      options: [
        { value: 'duplicate', label: 'Option 1', order: 0, active: true },
        { value: 'duplicate', label: 'Option 2', order: 1, active: true },
      ],
    });

    expect(() => FieldEntity.create(input)).toThrow(
      FieldOptionAlreadyExistsException.create(`option[1] - Option 2`, {
        value: 'duplicate',
      }),
    );
  });
});
