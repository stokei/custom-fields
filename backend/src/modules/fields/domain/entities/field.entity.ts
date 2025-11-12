import { AggregateRoot } from '@/shared/domain/base/aggregate-root';
import { ValidationError } from '@/shared/domain/errors/validation-error';
import { Guard } from '@/shared/domain/utils/guard';
import { UniqueEntityID } from '@/shared/domain/utils/unique-entity-id';
import { FieldCreatedEvent } from '../events/field-created/field-created.event';
import {
  FieldOptionValueObject,
  FieldOptionValueObjectProps,
} from '../value-objects/field-option.vo';
import { FieldTypeValueObject } from '../value-objects/field-type.vo';

interface FieldProps {
  tenantId: string;
  context: string;
  key: string;
  label: string;
  type: FieldTypeValueObject;
  required: boolean;
  isActive: boolean;
  version: number;
  order?: number;
  placeholder?: string;
  group?: string;
  options: FieldOptionValueObjectProps[];
}

export class FieldEntity extends AggregateRoot<FieldProps> {
  private constructor(props: FieldProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get id() {
    return super.id;
  }
  get tenantId() {
    return this.props.tenantId;
  }
  get context() {
    return this.props.context;
  }
  get key() {
    return this.props.key;
  }
  get label() {
    return this.props.label;
  }
  get type() {
    return this.props.type;
  }
  get required() {
    return this.props.required;
  }
  get isActive() {
    return this.props.isActive;
  }
  get version() {
    return this.props.version;
  }
  get options() {
    return this.props.options;
  }

  static create(input: FieldProps, id?: UniqueEntityID) {
    Guard.againstEmptyString(input.tenantId, 'tenantId');
    Guard.againstEmptyString(input.context, 'context');
    Guard.againstEmptyString(input.key, 'key');
    Guard.againstEmptyString(input.label, 'label');

    const options = input.options.map((o) => FieldOptionValueObject.create(o));
    if (input.type.isSelect() && options.length === 0) {
      throw new ValidationError('Select/Multi-Select requires options.');
    }

    const field = new FieldEntity(
      {
        tenantId: input.tenantId,
        context: input.context,
        key: input.key,
        label: input.label,
        type: input.type,
        required: input.required,
        isActive: true,
        version: 1,
        order: input.order,
        placeholder: input.placeholder,
        group: input.group,
        options,
      },
      id,
    );

    field.addDomainEvent(
      new FieldCreatedEvent(field.id, field.tenantId, field.context, field.key),
    );
    return field;
  }

  changeLabel(newLabel: string) {
    Guard.againstEmptyString(newLabel, 'label');
    this.props.label = newLabel;
  }

  deactivate() {
    this.props.isActive = false;
  }

  addOption(value: string, label: string, order?: number) {
    if (!this.props.type.isSelect())
      throw new ValidationError('Only select types accept options.');
    const exists = this.props.options.some((o) => o.value === value);
    if (exists) throw new ValidationError(`Option '${value}' already exists.`);
    this.props.options.push(
      FieldOptionValueObject.create({
        value,
        label,
        order,
        active: true,
      }),
    );
  }
}
