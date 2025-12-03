import { UniqueEntityID } from '@/shared/domain/utils/unique-entity-id';
import { convertToISODateString } from '@/utils/dates';
import {
  Prisma,
  Field as PrismaField,
  FieldOption as PrismaFieldOption,
} from '@prisma/client';
import { FieldEntity } from '../../domain/entities/field.entity';

export class FieldMapper {
  static toPersistence = (field: FieldEntity): Prisma.FieldCreateInput => {
    return {
      id: field.id,
      tenantId: field.tenantId,
      context: field.context,
      key: field.key,
      label: field.label,
      type: field.type.value,
      required: field.required,
      active: field.active,
      order: field.order ?? null,
      placeholder: field.placeholder ?? null,
      organizationId: field.organizationId,
      group: field.group,
    };
  };

  static toDomain(raw: PrismaField, rawOptions: PrismaFieldOption[] = []) {
    const field = FieldEntity.create(
      {
        tenantId: raw.tenantId,
        context: raw.context,
        key: raw.key,
        label: raw.label,
        type: raw.type,
        required: raw.required,
        order: raw.order ?? 0,
        placeholder: raw.placeholder ?? undefined,
        organizationId: raw.organizationId,
        minLength: raw.minLength ?? undefined,
        maxLength: raw.maxLength ?? undefined,
        pattern: raw.pattern ?? undefined,
        createdAt: convertToISODateString(raw.createdAt),
        updatedAt: convertToISODateString(raw.updatedAt),
        active: !!raw.active,
        group: raw.group,
        options: rawOptions?.map((option, defaultOrder) => ({
          active: option.active,
          value: option.value,
          label: option.label,
          order: option.order ?? defaultOrder,
        })),
      },
      new UniqueEntityID(raw.id),
    );
    return field;
  }
}
