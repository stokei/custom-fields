import { Prisma, FieldOption as PrismaFieldOption } from '@prisma/client';
import { FieldOptionValueObject } from '../../domain/value-objects/field-option.vo';

export class FieldOptionMapper {
  static toPersistence = (
    fieldId: string,
    fieldOption: FieldOptionValueObject,
  ): Prisma.FieldOptionCreateManyInput => {
    return {
      fieldId,
      value: fieldOption.value,
      label: fieldOption.label,
      active: fieldOption.active,
      order: fieldOption.order,
    };
  };

  static toDomain(raw: PrismaFieldOption) {
    const fieldOption = FieldOptionValueObject.create({
      value: raw.value,
      label: raw.label,
      active: raw.active,
      order: raw.order ?? 0,
    });
    return fieldOption;
  }
}
