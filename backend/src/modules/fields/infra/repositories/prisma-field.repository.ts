import { PrismaClientService } from '@/shared/infra/database/prisma/prisma-client.service';
import { Injectable } from '@nestjs/common';
import { FieldOption as PrismaFieldOption } from '@prisma/client';
import { FieldEntity } from '../../domain/entities/field.entity';
import {
  FieldRepository,
  GetAllByTenantContextParams,
  GetByTenantContextKeyParams,
} from '../../domain/repositories/field.repository';
import { FieldOptionValueObject } from '../../domain/value-objects/field-option.vo';
import { FieldOptionMapper } from '../mappers/field-option.mapper';
import { FieldMapper } from '../mappers/field.mapper';

@Injectable()
export class PrismaFieldRepository implements FieldRepository {
  constructor(private readonly prisma: PrismaClientService) {}

  async create(field: FieldEntity): Promise<void> {
    const data = FieldMapper.toPersistence(field);
    const options = field.options?.map((option) =>
      FieldOptionMapper.toPersistence(field.id, option),
    );
    await this.prisma.field.create({
      data: {
        ...data,
        options: {
          createMany: {
            data: options,
            skipDuplicates: false,
          },
        },
      },
    });
  }

  async update(field: FieldEntity): Promise<void> {
    const data = FieldMapper.toPersistence(field);
    delete data.id;
    await this.prisma.$transaction(async (transaction) => {
      await transaction.field.update({
        where: { id: field.id },
        data,
      });
      const desiredOptions = field.options?.map((option) =>
        FieldOptionMapper.toPersistence(field.id, option),
      );
      const existingOptions: PrismaFieldOption[] = await transaction.fieldOption.findMany({
        where: { fieldId: field.id },
      });

      const { toCreate, toUpdate } = FieldOptionMapper.toDiffOptions(
        existingOptions,
        desiredOptions,
      );
      for (const updateItem of toUpdate) {
        await transaction.fieldOption.update({
          where: { id: updateItem.id },
          data: updateItem.data,
        });
      }
      if (toCreate?.length) {
        await transaction.fieldOption.createMany({
          data: toCreate.map((option) =>
            FieldOptionMapper.toPersistence(field.id, FieldOptionValueObject.create(option)),
          ),
        });
      }
    });
  }

  async remove(field: FieldEntity): Promise<void> {
    const data = FieldMapper.toPersistence(field);
    delete data.id;
    await this.prisma.field.delete({
      where: { id: field.id },
    });
  }

  async getByTenantContextKey(
    params: GetByTenantContextKeyParams,
  ): Promise<FieldEntity | undefined> {
    const field = await this.prisma.field.findFirst({
      where: {
        tenantId: params.tenantId,
        organizationId: params.organizationId,
        context: params.context,
        key: params.key,
      },
    });

    if (!field) {
      return;
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
  async getAllByTenantContext(params: GetAllByTenantContextParams): Promise<FieldEntity[]> {
    const fields = await this.prisma.field.findMany({
      include: {
        options: {
          orderBy: [{ order: 'asc' }, { label: 'asc' }],
        },
      },
      where: {
        tenantId: params.tenantId,
        organizationId: params.organizationId,
        context: params.context,
      },
    });
    return fields?.map((field) => FieldMapper.toDomain(field, field.options));
  }
}
