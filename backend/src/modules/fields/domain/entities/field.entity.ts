import { AggregateRoot } from '@/shared/domain/base/aggregate-root';
import { Guard } from '@/shared/domain/guards/guard';
import { UniqueEntityID } from '@/shared/domain/utils/unique-entity-id';
import { convertToISODateString } from '@/utils/dates';
import { FieldOptionAlreadyExistsException } from '../errors/field-option-already-exists-exception';
import { FieldCreatedEvent } from '../events/field-created/field-created.event';
import {
  FieldOptionValueObject,
  FieldOptionValueObjectProps,
} from '../value-objects/field-option.vo';
import {
  FieldTypeEnum,
  FieldTypeValueObject,
} from '../value-objects/field-type.vo';

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
export interface CreateFieldInput
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
    return super.id;
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
    const inputValuesAreNullOrUndefinedGuard = Guard.combine([
      Guard.againstNullOrUndefined('tenantId', input.tenantId),
      Guard.againstNullOrUndefined('organizationId', input.organizationId),
      Guard.againstNullOrUndefined('context', input.context),
      Guard.againstNullOrUndefined('key', input.key),
      Guard.againstNullOrUndefined('label', input.label),
      Guard.againstNullOrUndefined('group', input.group),
      Guard.againstNullOrUndefined('type', input.type),
    ]);
    if (inputValuesAreNullOrUndefinedGuard.isFailure) {
      throw inputValuesAreNullOrUndefinedGuard.getErrorValue();
    }

    const minLength = input.minLength ?? null;
    const maxLength = input.maxLength ?? null;

    if (minLength !== null && maxLength !== null && minLength === maxLength) {
      const minLengthIsGreaterThanMaxLengthGuard = Guard.greaterThan(
        'minLength',
        minLength,
        maxLength,
      );
      if (minLengthIsGreaterThanMaxLengthGuard.isFailure) {
        throw minLengthIsGreaterThanMaxLengthGuard.getErrorValue();
      }
    }

    const type = FieldTypeValueObject.create(input.type);
    let inputOptions = input.options || [];
    if (type.hasOptions) {
      const optionsRequiredGuard = Guard.againstEmptyArray(
        'options',
        input.options,
      );
      if (optionsRequiredGuard.isFailure) {
        throw optionsRequiredGuard.getErrorValue();
      }
    }
    if (!type.hasOptions && !!input.options.length) {
      inputOptions = [];
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
        options: [],
      },
      id,
    );
    for (let index = 0; index < inputOptions.length; index++) {
      const option = inputOptions[index];
      field.addOption({
        ...option,
        order: index,
      });
    }
    if (!id) {
      field.addDomainEvent(new FieldCreatedEvent({ field }));
    }
    return field;
  }

  private addOption({
    value,
    label,
    order,
    active,
  }: FieldOptionValueObjectProps) {
    const exists = this.props.options.some((o) => o.value === value);
    if (exists)
      throw FieldOptionAlreadyExistsException.create(
        `option[${order}] - ${label}`,
        {
          value,
        },
      );
    this.props.options.push(
      FieldOptionValueObject.create({
        value,
        label,
        order,
        active: active ?? true,
      }),
    );
  }
}
