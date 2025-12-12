import { ArgumentEmptyStringException } from '@/shared/domain/errors/guards/argument-empty-string-exception';
import { ArgumentNullOrUndefinedException } from '@/shared/domain/errors/guards/argument-null-or-undefined-exception';
import { UniqueEntityID } from '@/shared/domain/utils/unique-entity-id';
import { tenantContextStub } from '@/tests/stubs/http/tenant-context.stub';

import { FieldOptionAlreadyActivatedException } from '../errors/field-option-already-activated-exception';
import { FieldOptionAlreadyDeactivatedException } from '../errors/field-option-already-deactivated-exception';
import { FieldOptionAlreadyExistsException } from '../errors/field-option-already-exists-exception';
import { FieldOptionNotFoundException } from '../errors/field-option-not-found-exception';
import { FieldOptionsIsNotAllowedException } from '../errors/field-options-is-not-allowed-exception';
import { FieldCreatedEvent } from '../events/field-created/field-created.event';
import { FieldComparatorEnum } from '../value-objects/field-comparator.vo';
import { FieldTypeEnum } from '../value-objects/field-type.vo';
import { CreateFieldInput, FieldEntity } from './field.entity';

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
  describe('create', () => {
    it('should create new user with default values and trigger FieldCreatedEvent', () => {
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

    it.each([
      'tenantId',
      'organizationId',
      'context',
      'key',
      'label',
      'group',
      'type',
    ] as (keyof FieldEntity)[])(`should throw an error when '%s' are empty`, (fieldKey) => {
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
  });

  describe('FieldOption', () => {
    let fieldEntity: FieldEntity;

    beforeEach(() => {
      const input = mountFieldEntityProps({
        type: FieldTypeEnum.SINGLE_SELECT,
        options: [{ value: 'one', label: 'Option 1', order: 0, active: true }],
      });
      fieldEntity = FieldEntity.create(input);
    });

    describe('addOption', () => {
      it('should add new option successfully', () => {
        expect(fieldEntity.options.length).toStrictEqual(1);
        expect(fieldEntity.options[0].order).toStrictEqual(0);
        fieldEntity.addOption({
          value: 'two',
          label: 'Option 2',
          active: true,
        });
        expect(fieldEntity.options.length).toStrictEqual(2);
        expect(fieldEntity.options[1].order).toStrictEqual(1);
        fieldEntity.addOption({
          value: 'three',
          label: 'Option 3',
          order: 10,
          active: true,
        });
        expect(fieldEntity.options.length).toStrictEqual(3);
        expect(fieldEntity.options[2].order).toStrictEqual(10);
      });

      it('should throw an error when field options is not allowed', () => {
        const input = mountFieldEntityProps({
          type: FieldTypeEnum.TEXT,
          options: [],
        });
        fieldEntity = FieldEntity.create(input);
        expect(() =>
          fieldEntity.addOption({
            value: 'some-value',
            label: 'Option X',
            order: 1,
            active: true,
          }),
        ).toThrow(
          FieldOptionsIsNotAllowedException.create(fieldEntity.key, fieldEntity.type.value),
        );
      });

      it('should throw an error when duplicate option value is provided', () => {
        expect(() =>
          fieldEntity.addOption({
            value: fieldEntity.options[0].value,
            label: 'Option X',
            order: 1,
            active: true,
          }),
        ).toThrow(FieldOptionAlreadyExistsException.create(fieldEntity.options[0].value));
      });

      it.each(['value', 'label'])(`should throw an error when '%s' are empty`, (fieldKey) => {
        expect(() =>
          FieldEntity.create(
            mountFieldEntityProps({
              type: FieldTypeEnum.SINGLE_SELECT,
              options: [
                {
                  value: 'one',
                  label: 'Option 1',
                  order: 0,
                  active: true,
                  [fieldKey]: '',
                },
              ],
            }),
          ),
        ).toThrow(ArgumentEmptyStringException.create(`option.${fieldKey}`));
      });
    });

    describe('updateOption', () => {
      it('should update option successfully', () => {
        expect(fieldEntity.options.length).toStrictEqual(1);
        expect(fieldEntity.options[0].label).toStrictEqual('Option 1');
        expect(fieldEntity.options[0].order).toStrictEqual(0);
        expect(fieldEntity.options[0].active).toStrictEqual(true);
        fieldEntity.updateOption('one', {
          label: 'Option N',
          order: 5,
        });
        expect(fieldEntity.options[0].value).toStrictEqual('one');
        expect(fieldEntity.options[0].label).toStrictEqual('Option N');
        expect(fieldEntity.options[0].order).toStrictEqual(5);
        expect(fieldEntity.options[0].active).toStrictEqual(true);
      });

      it('should throw an error when option is not found', () => {
        expect(() =>
          fieldEntity.updateOption(fieldEntity.options[0].value + '-any-other-value', {
            label: 'Oie',
          }),
        ).toThrow(
          FieldOptionNotFoundException.create(fieldEntity.options[0].value + '-any-other-value'),
        );
      });

      it('should throw an error when option value is empty', () => {
        expect(() => fieldEntity.updateOption('', {})).toThrow(
          ArgumentEmptyStringException.create('option.value'),
        );
      });
    });

    describe('deactivateOption', () => {
      it('should throw an error when option already deactivated', () => {
        expect(fieldEntity.options[0].active).toStrictEqual(true);
        fieldEntity.deactivateOption(fieldEntity.options[0].value);
        expect(fieldEntity.options[0].active).toStrictEqual(false);
      });

      it('should throw an error when option is not found', () => {
        expect(() =>
          fieldEntity.deactivateOption(fieldEntity.options[0].value + '-any-other-value'),
        ).toThrow(
          FieldOptionNotFoundException.create(fieldEntity.options[0].value + '-any-other-value'),
        );
      });

      it('should throw an error when option value is empty', () => {
        expect(() => fieldEntity.deactivateOption('')).toThrow(
          ArgumentEmptyStringException.create('option.value'),
        );
      });

      it('should throw an error when option already deactivated', () => {
        expect(() => {
          fieldEntity.deactivateOption(fieldEntity.options[0].value);
          fieldEntity.deactivateOption(fieldEntity.options[0].value);
        }).toThrow(FieldOptionAlreadyDeactivatedException.create(fieldEntity.options[0].value));
      });
    });

    describe('activateOption', () => {
      beforeEach(() => {
        const input = mountFieldEntityProps({
          type: FieldTypeEnum.SINGLE_SELECT,
          options: [{ value: 'one', label: 'Option 1', order: 0, active: false }],
        });
        fieldEntity = FieldEntity.create(input);
      });

      it('should throw an error when option already activated', () => {
        expect(fieldEntity.options[0].active).toStrictEqual(false);
        fieldEntity.activateOption(fieldEntity.options[0].value);
        expect(fieldEntity.options[0].active).toStrictEqual(true);
      });

      it('should throw an error when option is not found', () => {
        expect(() =>
          fieldEntity.deactivateOption(fieldEntity.options[0].value + '-any-other-value'),
        ).toThrow(
          FieldOptionNotFoundException.create(fieldEntity.options[0].value + '-any-other-value'),
        );
      });

      it('should throw an error when option value is empty', () => {
        expect(() => fieldEntity.deactivateOption('')).toThrow(
          ArgumentEmptyStringException.create('option.value'),
        );
      });

      it('should throw an error when option already activated', () => {
        expect(() => {
          fieldEntity.activateOption(fieldEntity.options[0].value);
          fieldEntity.activateOption(fieldEntity.options[0].value);
        }).toThrow(FieldOptionAlreadyActivatedException.create(fieldEntity.options[0].value));
      });
    });
  });
});
