import { AggregateRoot } from '@/shared/domain/base/aggregate-root';
import { ValidationError } from '@/shared/domain/errors/validation-error';
import { Guard } from '@/shared/domain/guards/guard';
import { UniqueEntityID } from '@/shared/domain/utils/unique-entity-id';
import { FieldCreatedEvent } from '../events/field-created/field-created.event';
import {
  FieldOptionValueObject,
  FieldOptionValueObjectProps,
} from '../value-objects/field-option.vo';
import {
  FieldTypeEnum,
  FieldTypeValueObject,
} from '../value-objects/field-type.vo';
import { convertToISODateString } from '@/utils/dates';

interface FieldProps {
  organizationId: string;
  tenantId: string;
  context: string;
  key: string;
  label: string;
  type: FieldTypeValueObject;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  placeholder?: string;
  group: string;
  createdAt: string;
  updatedAt: string;
  order: number;
  active: boolean;
  options: FieldOptionValueObject[];
}
interface CreateFieldInput
  extends Omit<FieldProps, 'type' | 'options' | 'createdAt' | 'updatedAt'> {
  type: FieldTypeEnum;
  options: FieldOptionValueObjectProps[];
  createdAt?: string;
  updatedAt?: string;
}

export class FieldEntity extends AggregateRoot<FieldProps> {
  private constructor(props: FieldProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get id(): string {
    return this._id.toString();
  }

  get tenantId(): string {
    return this.props.tenantId;
  }

  get organizationId(): string {
    return this.props.organizationId;
  }

  get context(): string {
    return this.props.context;
  }

  get key(): string {
    return this.props.key;
  }

  get label(): string {
    return this.props.label;
  }

  get type(): FieldTypeValueObject {
    return this.props.type;
  }

  get required(): boolean {
    return this.props.required;
  }

  get minLength(): number | undefined {
    return this.props.minLength;
  }

  get maxLength(): number | undefined {
    return this.props.maxLength;
  }

  get pattern(): string | undefined {
    return this.props.pattern;
  }

  get placeholder(): string | undefined {
    return this.props.placeholder;
  }

  get group(): string {
    return this.props.group;
  }

  get order(): number {
    return this.props.order;
  }

  get active(): boolean {
    return this.props.active;
  }

  get createdAt(): string {
    return this.props.createdAt;
  }

  get updatedAt(): string {
    return this.props.updatedAt;
  }

  get options(): FieldOptionValueObject[] {
    return this.props.options;
  }

  static create(input: CreateFieldInput, id?: UniqueEntityID) {
    Guard.againstEmptyString(input.tenantId, 'tenantId');
    Guard.againstEmptyString(input.context, 'context');
    Guard.againstEmptyString(input.key, 'key');
    Guard.againstEmptyString(input.label, 'label');
    Guard.againstEmptyString(input.type, 'type');

    const minLength = input.minLength ?? null;
    const maxLength = input.maxLength ?? null;

    if (minLength !== null && maxLength !== null && minLength > maxLength) {
      throw new ValidationError('minLength cannot be greater than maxLength.');
    }

    const options = input.options?.map((o) => FieldOptionValueObject.create(o));
    const type = FieldTypeValueObject.create(input.type);

    if (type.isSelect() && options.length === 0) {
      throw new ValidationError('Single-Select/Multi-Select requires options.');
    }

    const field = new FieldEntity(
      {
        organizationId: input.organizationId,
        tenantId: input.tenantId,
        context: input.context,
        key: input.key,
        label: input.label,
        type,
        required: input.required,
        active: true,
        order: input.order,
        placeholder: input.placeholder,
        group: input.group,
        maxLength: input.maxLength,
        minLength: input.minLength,
        pattern: input.pattern,
        createdAt: convertToISODateString(input.createdAt || Date.now()),
        updatedAt: convertToISODateString(input.updatedAt || Date.now()),
        options,
      },
      id,
    );

    return field;
  }

  addFieldCreatedDomainEvent() {
    this.addDomainEvent(new FieldCreatedEvent({ field: this }));
  }

  deactivate() {
    this.props.active = false;
  }

  addOption({ value, label, order, active }: FieldOptionValueObjectProps) {
    if (!this.type.isSelect())
      throw new ValidationError('Only select types accept options.');
    const exists = this.props.options.some((o) => o.value === value);
    if (exists) throw new ValidationError(`Option '${value}' already exists.`);
    this.props.options.push(
      FieldOptionValueObject.create({
        value,
        label,
        order,
        active: active ?? true,
      }),
    );
  }

  removeOptionByValue(value: string): void {
    if (!this.type.isSelect()) {
      throw new ValidationError('Only select fields can have options.');
    }

    const beforeOptionsCount = this.props.options.length;
    this.props.options = this.props.options.filter(
      (opt) => opt.value !== value,
    );
    const currentOptionsCount = this.props.options.length;
    if (currentOptionsCount === beforeOptionsCount) {
      throw new ValidationError(`Option not found: ${value}`);
    }
    if (!currentOptionsCount) {
      throw new ValidationError(
        'Select/Multi-Select requires at least one option.',
      );
    }
  }
}
