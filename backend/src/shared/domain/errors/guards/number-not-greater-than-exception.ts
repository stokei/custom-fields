import { ValidationException } from '../base/validation-exception';

export interface NumberNotGreaterThanDetails {
  minValue: number;
  actualValue: number;
}

export class NumberNotGreaterThanException extends ValidationException<NumberNotGreaterThanDetails> {
  private constructor(details: NumberNotGreaterThanDetails) {
    super(
      `Number given {${details.actualValue}} is not greater than {${details.minValue}}.`,
      'NUMBER_NOT_GREATER_THAN',
      details,
    );
  }

  static create(minValue: number, actualValue: number) {
    return new NumberNotGreaterThanException({ minValue, actualValue });
  }
}
