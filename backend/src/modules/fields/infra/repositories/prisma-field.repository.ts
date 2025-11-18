import { FieldOption as PrismaFieldOption } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaClientService } from '@/shared/infra/prisma/prisma-client.service';
import {
  FieldRepository,
  GetByTenantContextKeyParams,
} from '../../domain/repositories/field.repository';
import { FieldEntity } from '../../domain/entities/field.entity';
import { FieldMapper } from '../mappers/field.mapper';
import { FieldOptionMapper } from '../mappers/field-option.mapper';
import { FieldOptionValueObject } from '../../domain/value-objects/field-option.vo';

@Injectable()
export class PrismaFieldRepository implements FieldRepository {
  constructor(private readonly prisma: PrismaClientService) { }

  async save(field: FieldEntity): Promise<void> {
    const { id: fieldId, ...data } = FieldMapper.toPersistence(field);
    await this.prisma.$transaction(async (transaction) => {
      await transaction.field.upsert({
        where: { id: fieldId },
        create: data,
        update: data,
      });
      const desiredOptions = field.options?.map((option) =>
        FieldOptionMapper.toPersistence(field.id, option),
      );
      const existingOptions: PrismaFieldOption[] =
        await transaction.fieldOption.findMany({
          where: { fieldId: field.id },
        });

      const { toCreate, toUpdate, toDeleteIds } =
        FieldOptionMapper.toDiffOptions(existingOptions, desiredOptions);
      if (toDeleteIds.length) {
        await transaction.fieldOption.deleteMany({
          where: { id: { in: toDeleteIds } },
        });
      }
      for (const updateItem of toUpdate) {
        await transaction.fieldOption.update({
          where: { id: updateItem.id },
          data: updateItem.data,
        });
      }
      if (toCreate?.length) {
        await transaction.fieldOption.createMany({
          data: toCreate.map((option) =>
            FieldOptionMapper.toPersistence(
              field.id,
              FieldOptionValueObject.create(option),
            ),
          ),
        });
      }
    });
  }

  async getByTenantContextKey(
    params: GetByTenantContextKeyParams,
  ): Promise<FieldEntity | null> {
    const field = await this.prisma.field.findFirst({
      where: {
        tenantId: params.tenantId,
        context: params.context,
        key: params.key,
      },
    });

    if (!field) {
      return null;
    }

    const optionRows = await this.prisma.fieldOption.findMany({
      where: {
        fieldId: field.id,
        active: true,
      },
      orderBy: [{ order: 'asc' }, { label: 'asc' }],
    });

    return FieldMapper.toDomain(field, optionRows);
  }
}
