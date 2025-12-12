import { Entity } from '@/shared/domain/base/entity';
import { Guard } from '@/shared/domain/guards/guard';
import { UniqueEntityID } from '@/shared/domain/utils/unique-entity-id';

import { FieldValueValidatorFactory } from '../validation/field-values/field-value-validator.factory';
import { FieldEntity } from './field.entity';

export interface FieldValuesProps {
  entityId: string;
  field: FieldEntity;
  values: string[];
}

export interface FieldValuesCreateProps {
  entityId: string;
  field: FieldEntity;
  values: string[];
}

export class FieldValuesEntity extends Entity<FieldValuesProps> {
  private constructor(props: FieldValuesProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get entityId(): string {
    return this.props.entityId;
  }

  get field(): FieldEntity {
    return this.props.field;
  }

  get values(): string[] {
    return this.props.values;
  }

  static create(props: FieldValuesCreateProps): FieldValuesEntity {
    const guardResult = Guard.againstNullOrUndefined('entityId', props.entityId);
    if (guardResult.isFailure) {
      throw guardResult.getErrorValue();
    }
    const valid = FieldValueValidatorFactory.validate({
      field: props.field,
      entityId: props.entityId,
      values: props.values,
    });
    if (valid.isFailure) {
      throw valid.getErrorValue();
    }

    const fieldValues = new FieldValuesEntity({
      field: props.field,
      entityId: props.entityId,
      values: props.values,
    });
    return fieldValues;
  }
}
