import { AggregateRoot } from '@/shared/domain/base/aggregate-root';
import { Guard } from '@/shared/domain/guards/guard';
import { UniqueEntityID } from '@/shared/domain/utils/unique-entity-id';
import { convertToISODateString } from '@/utils/dates';

import { FieldAlreadyActivatedException } from '../errors/field-already-activated-exception';
import { FieldAlreadyDeactivatedException } from '../errors/field-already-deactivated-exception';
import { FieldOptionAlreadyActivatedException } from '../errors/field-option-already-activated-exception';
import { FieldOptionAlreadyDeactivatedException } from '../errors/field-option-already-deactivated-exception';
import { FieldOptionAlreadyExistsException } from '../errors/field-option-already-exists-exception';
import { FieldOptionNotFoundException } from '../errors/field-option-not-found-exception';
import { FieldOptionsIsNotAllowedException } from '../errors/field-options-is-not-allowed-exception';
import { FieldActivatedEvent } from '../events/field-activated/field-activated.event';
import { FieldCreatedEvent } from '../events/field-created/field-created.event';
import { FieldDeactivatedEvent } from '../events/field-deactivated/field-deactivated.event';
import { FieldUpdatedEvent } from '../events/field-updated/field-updated.event';
import {
  FieldComparatorEnum,
  FieldComparatorValueObject,
} from '../value-objects/field-comparator.vo';
import {
  FieldOptionValueObject,
  FieldOptionValueObjectProps,
} from '../value-objects/field-option.vo';
import { FieldTypeEnum, FieldTypeValueObject } from '../value-objects/field-type.vo';

interface FieldProps {
  organizationId: string;
  tenantId: string;
  context: string;
  key: string;
  label: string;
  type: FieldTypeValueObject;
  comparator: FieldComparatorValueObject;
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
  options: Map<string, FieldOptionValueObject>;
}
export interface CreateFieldInput
  extends Omit<FieldProps, 'type' | 'comparator' | 'options' | 'createdAt' | 'updatedAt'> {
  type: FieldTypeEnum;
  comparator: FieldComparatorEnum;
  options: FieldOptionValueObjectProps[];
  createdAt?: string;
  updatedAt?: string;
}
export interface UpdateFieldInput {
  label?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  placeholder?: string;
  group?: string;
  order?: number;
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

  get comparator(): FieldComparatorValueObject {
    return this.props.comparator;
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
    return [...this.props.options.values()];
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
      Guard.againstNullOrUndefined('comparator', input.comparator),
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

    const comparator = FieldComparatorValueObject.create(input.comparator);
    const type = FieldTypeValueObject.create(input.type);
    let inputOptions = input.options || [];
    if (type.hasOptions) {
      const optionsRequiredGuard = Guard.againstEmptyArray('options', input.options);
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
        comparator,
        required: input.required,
        active: input.active ?? true,
        order: input.order,
        placeholder: input.placeholder,
        group: input.group,
        maxLength: input.maxLength,
        minLength: input.minLength,
        pattern: input.pattern,
        createdAt: convertToISODateString(input.createdAt || Date.now()),
        updatedAt: convertToISODateString(input.updatedAt || Date.now()),
        options: new Map(),
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

  public deactivate() {
    if (!this.active) {
      throw FieldAlreadyDeactivatedException.create(this.key);
    }
    this.props.active = false;
    this.addDomainEvent(new FieldDeactivatedEvent({ field: this }));
  }
  public activate() {
    if (this.active) {
      throw FieldAlreadyActivatedException.create(this.key);
    }
    this.props.active = true;
    this.addDomainEvent(new FieldActivatedEvent({ field: this }));
  }

  public update(input: UpdateFieldInput) {
    this.props.label = input.label || this.label;
    this.props.required = input.required || this.required;
    this.props.minLength = input.minLength || this.minLength;
    this.props.maxLength = input.maxLength || this.maxLength;
    this.props.pattern = input.pattern || this.pattern;
    this.props.placeholder = input.placeholder || this.placeholder;
    this.props.group = input.group || this.group;
    this.props.order = input.order || this.order;

    this.addDomainEvent(new FieldUpdatedEvent({ field: this }));
  }

  public addOption({ value, label, order, active }: FieldOptionValueObjectProps) {
    if (!this.type.hasOptions) {
      throw FieldOptionsIsNotAllowedException.create(this.key, this.type.value);
    }

    const newOption = FieldOptionValueObject.create({
      value,
      label,
      order: order || this.props.options.size,
      active: active ?? true,
    });
    const exists = this.props.options.has(newOption.value);
    if (exists) {
      throw FieldOptionAlreadyExistsException.create(value);
    }
    this.props.options.set(newOption.value, newOption);
  }

  public updateOption(
    value: string,
    { label, order }: Partial<Omit<FieldOptionValueObjectProps, 'active' | 'value'>>,
  ) {
    const resultGuard = Guard.againstEmptyString('option.value', value);
    if (resultGuard.isFailure) {
      throw resultGuard.getErrorValue();
    }
    const currentOption = this.props.options.get(value);
    if (!currentOption) throw FieldOptionNotFoundException.create(value);

    this.props.options.set(
      value,
      FieldOptionValueObject.create({
        value,
        label: label || currentOption.label,
        order: order || currentOption.order,
        active: currentOption.active,
      }),
    );
  }

  public deactivateOption(value: string) {
    const resultGuard = Guard.againstEmptyString('option.value', value);
    if (resultGuard.isFailure) {
      throw resultGuard.getErrorValue();
    }
    const currentOption = this.props.options.get(value);
    if (!currentOption) throw FieldOptionNotFoundException.create(value);
    if (!currentOption.active) throw FieldOptionAlreadyDeactivatedException.create(value);

    this.props.options.set(
      value,
      FieldOptionValueObject.create({
        value,
        label: currentOption.label,
        order: currentOption.order,
        active: false,
      }),
    );
  }

  public activateOption(value: string) {
    const resultGuard = Guard.againstEmptyString('option.value', value);
    if (resultGuard.isFailure) {
      throw resultGuard.getErrorValue();
    }
    const currentOption = this.props.options.get(value);
    if (!currentOption) throw FieldOptionNotFoundException.create(value);
    if (currentOption.active) throw FieldOptionAlreadyActivatedException.create(value);

    this.props.options.set(
      value,
      FieldOptionValueObject.create({
        value,
        label: currentOption.label,
        order: currentOption.order,
        active: true,
      }),
    );
  }
}
