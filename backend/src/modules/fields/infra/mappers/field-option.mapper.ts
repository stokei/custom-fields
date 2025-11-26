import { Prisma, FieldOption as PrismaFieldOption } from '@prisma/client';
import { FieldOptionValueObject } from '../../domain/value-objects/field-option.vo';

export type FieldOptionPersistence = Prisma.FieldOptionCreateManyInput;

interface OptionDiff {
  toCreate: FieldOptionPersistence[];
  toUpdate: Array<{
    id: string;
    data: FieldOptionPersistence;
  }>;
  toDelete: FieldOptionPersistence[];
}

export class FieldOptionMapper {
  static toPersistence = (
    fieldId: string,
    fieldOption: FieldOptionValueObject,
  ): FieldOptionPersistence => {
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

  static toDiffOptions = (
    existing: PrismaFieldOption[],
    desired: FieldOptionPersistence[],
  ): OptionDiff => {
    const existingByValue = new Map<string, PrismaFieldOption>();
    existing.forEach((opt: PrismaFieldOption) => {
      existingByValue.set(opt.value, opt);
    });

    const desiredByValue = new Map<string, FieldOptionPersistence>();
    desired.forEach((opt: FieldOptionPersistence) => {
      desiredByValue.set(opt.value, opt);
    });

    const toCreate: OptionDiff['toCreate'] = [];
    const toUpdate: OptionDiff['toUpdate'] = [];
    const toDelete: OptionDiff['toDelete'] = [];

    for (const desiredOpt of desired) {
      const existingOpt = existingByValue.get(desiredOpt.value);

      if (!existingOpt) {
        toCreate.push(desiredOpt);
        continue;
      }

      const needsUpdate =
        existingOpt.label !== desiredOpt.label ||
        (existingOpt.order ?? 0) !== desiredOpt.order ||
        existingOpt.active !== desiredOpt.active;

      if (needsUpdate) {
        toUpdate.push({
          id: existingOpt.id,
          data: desiredOpt,
        });
      }
    }

    for (const existingOpt of existing) {
      if (!desiredByValue.has(existingOpt.value)) {
        toDelete.push(existingOpt);
      }
    }

    return { toCreate, toUpdate, toDelete };
  };
}
