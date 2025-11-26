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
import { FieldOptionValueObject } from '../../domain/value-objects/field-option.vo';
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
    const exists = this.fields.exists(data);
    if (!exists) {
      this.fields.add(data);
    } else {
      this.fields.remove(data);
      this.fields.add(data);
    }
    const desiredOptions = field.options?.map((option) =>
      FieldOptionMapper.toPersistence(field.id, option),
    );
    const existingOptions = this.fieldOptions.get(field.id);

    const { toCreate, toUpdate, toDelete } = FieldOptionMapper.toDiffOptions(
      existingOptions?.getItems?.() || [],
      desiredOptions,
    );
    if (toDelete.length) {
      toDelete?.map(existingOptions?.remove);
    }
    for (const updateItem of toUpdate) {
      existingOptions?.remove(updateItem);
      existingOptions?.add(updateItem);
    }
    if (toCreate?.length) {
      toCreate.map((option) =>
        existingOptions?.add(
          FieldOptionMapper.toPersistence(
            field.id,
            FieldOptionValueObject.create(option),
          ),
        ),
      );
    }
  }

  async getByTenantContextKey(
    params: GetByTenantContextKeyParams,
  ): Promise<FieldEntity | null> {
    const field = this.fields.getItems(
      (field) =>
        field.tenantId === params.tenantId &&
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
