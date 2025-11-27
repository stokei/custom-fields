import { ArrayList } from '@/shared/domain/base/array-list';
import { Injectable } from '@nestjs/common';
import {
  Field as PrismaField,
  FieldOption as PrismaFieldOption,
} from '@prisma/client';
import { FieldEntity } from '../../domain/entities/field.entity';
import {
  FieldRepository,
  GetByTenantContextKeyParams,
} from '../../domain/repositories/field.repository';
import { UniqueEntityID } from '@/shared/domain/utils/unique-entity-id';
import { FieldOptionMapper } from '../mappers/field-option.mapper';
import { FieldMapper } from '../mappers/field.mapper';

class FieldsArrayList extends ArrayList<PrismaField> {
  constructor() {
    super([]);
  }
  compareItems(a: PrismaField, b: PrismaField): boolean {
    return a.id === b.id;
  }
}
class FieldOptionsArrayList extends ArrayList<PrismaFieldOption> {
  constructor() {
    super([]);
  }
  compareItems(a: PrismaFieldOption, b: PrismaFieldOption): boolean {
    return a.id === b.id;
  }
}

@Injectable()
export class LocalFieldRepository implements FieldRepository {
  private readonly fields = new FieldsArrayList();
  private readonly fieldOptions = new Map<string, FieldOptionsArrayList>();

  async save(field: FieldEntity): Promise<void> {
    const data = FieldMapper.toPersistence(field);
    const fieldPersistence: PrismaField = {
      id: data.id ?? new UniqueEntityID().toString(),
      tenantId: data.tenantId as string,
      organizationId: data.organizationId as string,
      context: data.context as string,
      key: data.key as string,
      label: data.label as string,
      type: data.type as PrismaField['type'],
      required: data.required ?? false,
      minLength: data.minLength ?? null,
      maxLength: data.maxLength ?? null,
      pattern: data.pattern ?? null,
      placeholder: data.placeholder ?? null,
      group: data.group as string,
      order: data.order ?? 0,
      active: data.active ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const exists = this.fields.exists(fieldPersistence);
    if (!exists) {
      this.fields.add(fieldPersistence);
    } else {
      this.fields.remove(fieldPersistence);
      this.fields.add(fieldPersistence);
    }
    const desiredOptions = field.options?.map((option) =>
      FieldOptionMapper.toPersistence(field.id, option),
    );
    let existingOptions = this.fieldOptions.get(field.id);
    if (!existingOptions) {
      existingOptions = new FieldOptionsArrayList();
      this.fieldOptions.set(field.id, existingOptions);
    }

    const existingOptionsList = existingOptions.getItems();
    const { toCreate, toUpdate, toDelete } = FieldOptionMapper.toDiffOptions(
      existingOptionsList || [],
      desiredOptions || [],
    );
    if (toDelete.length) {
      toDelete.forEach((del) => existingOptions?.remove(del));
    }
    for (const updateItem of toUpdate) {
      const existing = existingOptions.getItemBy((o) => o.id === updateItem.id);
      if (existing) {
        existingOptions.remove(existing);
        existingOptions.add({
          ...existing,
          ...updateItem.data,
        } as PrismaFieldOption);
      }
    }
    if (toCreate?.length) {
      for (const option of toCreate) {
        const newOption: PrismaFieldOption = {
          id: new UniqueEntityID().toString(),
          fieldId: field.id,
          value: option.value,
          label: option.label,
          order: option.order ?? 0,
          active: option.active ?? true,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as PrismaFieldOption;
        existingOptions.add(newOption);
      }
    }
  }

  async getByTenantContextKey(
    params: GetByTenantContextKeyParams,
  ): Promise<FieldEntity | null> {
    const field = this.fields.getItems(
      (field) =>
        field.tenantId === params.tenantId &&
        field.organizationId === params.organizationId &&
        field.context === params.context &&
        field.key === params.key,
    )?.[0];

    if (!field) {
      return null;
    }

    const options = this.fieldOptions.get(field.id);
    const optionRows = options?.getItems(
      (option) => option.fieldId === field.id && !!option.active,
    );

    return FieldMapper.toDomain(field, optionRows);
  }
}
