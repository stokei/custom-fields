import { FieldReadModel } from '../../application/dtos/field-read-model.dto';
import { FieldEntity } from '../../domain/entities/field.entity';
import { FieldTypeValueObject } from '../../domain/value-objects/field-type.vo';

export class FieldMapper {
  // domínio → persistência (Prisma)
  static toPersistence = (field: FieldEntity) => ({
    id: field.id,
    tenantId: field.tenantId,
    context: field.context,
    key: field.key,
    label: field.label,
    type: field.type.value,
    required: field.required,
    isActive: field.isActive,
    version: field.version,
    order: (field as any).props.order ?? null,
    placeholder: (field as any).props.placeholder ?? null,
    group: (field as any).props.group ?? null,
    // options: handled separately (child table)
  });

  // persistência → DTO de leitura
  static toReadModel(raw: any, rawOptions: any[] = []): FieldReadModel {
    return {
      id: raw.id,
      tenantId: raw.tenantId,
      context: raw.context,
      key: raw.key,
      label: raw.label,
      type: raw.type,
      required: raw.required,
      isActive: raw.isActive,
      version: raw.version,
      order: raw.order,
      placeholder: raw.placeholder,
      group: raw.group,
      options: rawOptions.map((o) => ({
        value: o.value,
        label: o.label,
        order: o.order ?? 0,
        isActive: o.isActive,
      })),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }

  // persistência → domínio (quando precisar reconstruir aggregate)
  static toDomain(raw: any, rawOptions: any[] = []) {
    const type = FieldTypeValueObject.create(raw.type);
    const field = (FieldEntity as any).create(
      {
        tenantId: raw.tenantId,
        context: raw.context,
        key: raw.key,
        label: raw.label,
        type,
        required: raw.required,
        order: raw.order ?? undefined,
        placeholder: raw.placeholder ?? undefined,
        group: raw.group ?? undefined,
        options: rawOptions.map((o) => ({
          value: o.value,
          label: o.label,
          order: o.order ?? undefined,
        })),
      },
      {
        /* id handled below */
      },
    );

    // forçar id e estado sem adicionar evento de criação
    field._id = { toString: () => raw.id };
    field.props.isActive = raw.isActive;
    field.props.version = raw.version;
    field.clearEvents?.();

    return field as FieldEntity;
  }
}
