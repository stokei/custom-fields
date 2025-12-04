import { CreateFieldInput, FieldEntity } from '@/modules/fields/domain/entities/field.entity';
import { tenantContextStub } from '../../http/tenant-context.stub';
import { FieldTypeEnum } from '@/modules/fields/domain/value-objects/field-type.vo';
import { convertToISODateString } from '@/utils/dates';
import { UniqueEntityID } from '@/shared/domain/utils/unique-entity-id';

export const createSingleSelectFieldEntityStub = (
  overrides?: Partial<CreateFieldInput>,
  id?: UniqueEntityID,
) =>
  FieldEntity.create(
    {
      ...tenantContextStub,
      context: overrides?.context || 'CUSTOMER',
      active: overrides?.active || true,
      group: overrides?.group || 'GENERAL',
      key: overrides?.key || 'status',
      label: overrides?.label || 'Status',
      type: overrides?.type || FieldTypeEnum.SINGLE_SELECT,
      required: overrides?.required || true,
      minLength: overrides?.minLength || undefined,
      maxLength: overrides?.maxLength || undefined,
      pattern: overrides?.pattern || undefined,
      placeholder: overrides?.placeholder || 'Select status',
      order: overrides?.order || 0,
      createdAt: overrides?.createdAt || convertToISODateString(Date.now()),
      updatedAt: overrides?.updatedAt || convertToISODateString(Date.now()),
      options: [
        { value: 'active', label: 'Ativo' },
        { value: 'inactive', label: 'Inativo' },
      ],
    },
    id,
  );
