import { CreateFieldInput, FieldEntity } from '@/modules/fields/domain/entities/field.entity';
import { FieldComparatorEnum } from '@/modules/fields/domain/value-objects/field-comparator.vo';
import { FieldTypeEnum } from '@/modules/fields/domain/value-objects/field-type.vo';
import { UniqueEntityID } from '@/shared/domain/utils/unique-entity-id';
import { convertToISODateString } from '@/utils/dates';

import { tenantContextStub } from '../../http/tenant-context.stub';

export const createRadioFieldEntityStub = (
  overrides?: Partial<CreateFieldInput>,
  id?: UniqueEntityID,
) =>
  FieldEntity.create(
    {
      ...tenantContextStub,
      context: overrides?.context || 'CUSTOMER',
      active: overrides?.active ?? true,
      group: overrides?.group || 'GENERAL',
      key: overrides?.key || 'name',
      label: overrides?.label || 'Name',
      type: overrides?.type || FieldTypeEnum.RADIO,
      comparator: overrides?.comparator || FieldComparatorEnum.EQUALS,
      required: overrides?.required ?? true,
      minLength: overrides?.minLength || undefined,
      maxLength: overrides?.maxLength || undefined,
      pattern: overrides?.pattern || undefined,
      placeholder: overrides?.placeholder || "What's your name",
      order: overrides?.order || 0,
      createdAt: overrides?.createdAt || convertToISODateString(Date.now()),
      updatedAt: overrides?.updatedAt || convertToISODateString(Date.now()),
      options: [
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two' },
        { value: 'three', label: 'Three' },
      ],
    },
    id,
  );
