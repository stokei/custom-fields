import { ArrayList } from '@/shared/domain/base/array-list';
import { Injectable } from '@nestjs/common';
import { Field as PrismaField, FieldOption as PrismaFieldOption } from '@prisma/client';
import { FieldEntity } from '../../domain/entities/field.entity';
import {
  FieldRepository,
  GetAllByTenantContextParams,
  GetByTenantContextKeyParams,
} from '../../domain/repositories/field.repository';
import { UniqueEntityID } from '@/shared/domain/utils/unique-entity-id';
import { FieldOptionMapper } from '../mappers/field-option.mapper';
import { FieldMapper } from '../mappers/field.mapper';
import { FieldAlreadyExistsException } from '../../domain/errors/field-already-exists-exception';

class FieldsArrayList extends ArrayList<PrismaField> {
  constructor() {
    super([]);
  }
  compareItems(a: PrismaField, b: PrismaField): boolean {
    return a.id === b.id;
  }
}
class FieldOptionsArrayList extends ArrayList<PrismaFieldOption> {
  constructor(initialList?: PrismaFieldOption[]) {
    super(initialList || []);
  }
  compareItems(a: PrismaFieldOption, b: PrismaFieldOption): boolean {
    return a.id === b.id;
  }
}

@Injectable()
export class LocalFieldRepository implements FieldRepository {
  private readonly fields = new FieldsArrayList();
  private readonly fieldOptions = new Map<string, FieldOptionsArrayList>();

  async create(field: FieldEntity): Promise<void> {
    const data = FieldMapper.toPersistence(field);
    const fieldPersistence: PrismaField = {
      id: data.id ?? new UniqueEntityID().toString(),
      tenantId: data.tenantId,
      organizationId: data.organizationId,
      context: data.context,
      key: data.key,
      label: data.label,
      type: data.type,
      required: data.required ?? false,
      minLength: data.minLength ?? null,
      maxLength: data.maxLength ?? null,
      pattern: data.pattern ?? null,
      placeholder: data.placeholder ?? null,
      group: data.group,
      order: data.order ?? 0,
      active: data.active ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const exists = this.fields.exists(fieldPersistence);
    if (exists) {
      throw FieldAlreadyExistsException.create({
        key: data.key,
        organizationId: data.organizationId,
        context: data.context,
      });
    }
    this.fields.add(fieldPersistence);
    const options = field.options
      ?.map((option) => FieldOptionMapper.toPersistence(field.id, option))
      .map(
        (option) =>
          ({
            id: new UniqueEntityID().toString(),
            fieldId: field.id,
            value: option.value,
            label: option.label,
            order: option.order ?? 0,
            active: option.active ?? true,
            createdAt: new Date(),
            updatedAt: new Date(),
          }) as PrismaFieldOption,
      );
    this.fieldOptions.set(field.id, new FieldOptionsArrayList(options));
  }

  async update(field: FieldEntity): Promise<void> {
    const data = FieldMapper.toPersistence(field);
    const fieldPersistence: PrismaField = {
      id: data.id ?? new UniqueEntityID().toString(),
      tenantId: data.tenantId,
      organizationId: data.organizationId,
      context: data.context,
      key: data.key,
      label: data.label,
      type: data.type,
      required: data.required ?? false,
      minLength: data.minLength ?? null,
      maxLength: data.maxLength ?? null,
      pattern: data.pattern ?? null,
      placeholder: data.placeholder ?? null,
      group: data.group,
      order: data.order ?? 0,
      active: data.active ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const exists = this.fields.exists(fieldPersistence);
    if (!exists) {
      this.fields.add(fieldPersistence);
    } else {
      // ADICIONAR UMA FUNÇÃO DE UPDATE DO ARRAY
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
    const { toCreate, toUpdate } = FieldOptionMapper.toDiffOptions(
      existingOptionsList || [],
      desiredOptions || [],
    );

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

  async getByTenantContextKey(params: GetByTenantContextKeyParams): Promise<FieldEntity | null> {
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

  async getAllByTenantContext(params: GetAllByTenantContextParams): Promise<FieldEntity[]> {
    const fields = this.fields.getItems(
      (field) =>
        field.context === params.context &&
        field.organizationId === params.organizationId &&
        field.tenantId === params.tenantId,
    );

    return fields?.map((field) => {
      const options = this.fieldOptions.get(field.id);
      return FieldMapper.toDomain(field, options?.getItems() || []);
    });
  }
}
