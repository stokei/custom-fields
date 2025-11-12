import { Injectable } from '@nestjs/common';
import { PrismaClientService } from '@/shared/infra/prisma/prisma-client.service';
import { FieldRepository } from '../../domain/repositories/field.repository';
import { FieldEntity } from '../../domain/entities/field.entity';
import { FieldMapper } from '../mappers/field.mapper';

@Injectable()
export class PrismaFieldRepository implements FieldRepository {
  constructor(private readonly prisma: PrismaClientService) { }

  async save(field: FieldEntity) {
    const payload = FieldMapper.toPersistence(field);
    const response = FieldMapper.toReadModel(payload, field.options);
    return response;
  }

  async findById(id: string) {
    const raw = await this.prisma.customFieldDefinition.findUnique({
      where: { id },
    });
    if (!raw) return null;
    const options = await this.prisma.customFieldOption.findMany({
      where: { fieldId: raw.id, isActive: true },
      orderBy: [{ order: 'asc' }, { label: 'asc' }],
    });
    return FieldMapper.toReadModel(raw, options);
  }
}
