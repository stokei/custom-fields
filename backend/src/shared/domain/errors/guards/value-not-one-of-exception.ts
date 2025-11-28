import { ValidationException } from '../base/validation-exception';

export interface ValueNotOneOfDetails<TValue = any> {
  value: TValue;
  validValues: TValue[];
}

export class ValueNotOneOfException<TValue = any> extends ValidationException<
  ValueNotOneOfDetails<TValue>
> {
  private constructor(
    argumentName: string,
    details: ValueNotOneOfDetails<TValue>,
  ) {
    super(
      argumentName,
      `isn't oneOf the correct types in ${JSON.stringify(
        details.validValues,
      )}. Got "${details.value + ''}".`,
      'VALUE_NOT_ONE_OF',
      details,
    );
  }

  static create<TValue = any>(
    argumentName: string,
    details: ValueNotOneOfDetails<TValue>,
  ) {
    return new ValueNotOneOfException<TValue>(argumentName, details);
  }
}
