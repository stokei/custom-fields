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

@Injectable()
export class PrismaFieldRepository implements FieldRepository {
  constructor(private readonly prisma: PrismaClientService) { }

  async create(field: FieldEntity): Promise<void> {
    const data = FieldMapper.toPersistence(field);
    await this.prisma.$transaction(async (transaction) => {
      await transaction.field.create({ data });
      await transaction.fieldOption.deleteMany({ where: { fieldId: data.id } });
      const opts = field.options?.map((option) =>
        FieldOptionMapper.toPersistence(field.id, option),
      );
      if (opts.length) {
        await transaction.fieldOption.createMany({
          data: opts,
        });
      }
    });
  }

  async update(field: FieldEntity): Promise<void> {
    const { id, ...data } = FieldMapper.toPersistence(field);
    await this.prisma.field.update({
      where: { id },
      data,
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

    const optionRows: PrismaFieldOption[] =
      await this.prisma.fieldOption.findMany({
        where: {
          fieldId: field.id,
          active: true,
        },
        orderBy: [{ order: 'asc' }, { label: 'asc' }],
      });

    return FieldMapper.toDomain(field, optionRows);
  }
}
