import { FieldReadModel } from '../../application/dtos/field-read-model.dto';
import { FieldEntity } from '../../domain/entities/field.entity';

export class FieldMapper {
  static toReadModel = (field: FieldEntity): FieldReadModel => {
    return {
      id: field.id,
      context: field.context,
      key: field.key,
      label: field.label,
      type: field.type.value,
      required: field.required,
      active: field.active,
      order: field.order,
      placeholder: field.placeholder,
      minLength: field.minLength,
      maxLength: field.maxLength,
      pattern: field.pattern,
      createdAt: field.createdAt,
      updatedAt: field.updatedAt,
      options: field.options,
    };
  };
}
