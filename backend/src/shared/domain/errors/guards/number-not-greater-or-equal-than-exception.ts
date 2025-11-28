import { ValidationException } from '../base/validation-exception';
export interface NumberNotGreaterOrEqualThanDetails {
  minValue: number;
  actualValue: number;
}

export class NumberNotGreaterOrEqualThanException extends ValidationException<NumberNotGreaterOrEqualThanDetails> {
  private constructor(
    argumentName: string,
    details: NumberNotGreaterOrEqualThanDetails,
  ) {
    super(
      argumentName,
      `Number given {${details.actualValue}} is not greater or equal than {${details.minValue}}.`,
      'NUMBER_NOT_GREATER_OR_EQUAL_THAN',
      details,
    );
  }

  static create(
    argumentName: string,
    details: NumberNotGreaterOrEqualThanDetails,
  ) {
    return new NumberNotGreaterOrEqualThanException(argumentName, details);
  }
}
