import { ExceptionCode } from '../base/exception-codes';
import { ValidationException } from '../base/validation-exception';

export interface NumberNotGreaterThanDetails {
  minValue: number;
  actualValue: number;
}

export class NumberNotGreaterThanException extends ValidationException<NumberNotGreaterThanDetails> {
  private constructor(argumentName: string, details: NumberNotGreaterThanDetails) {
    super(
      argumentName,
      `Number given {${details.actualValue}} is not greater than {${details.minValue}}.`,
      ExceptionCode.NUMBER_NOT_GREATER_THAN,
      [details],
    );
  }

  static create(argumentName: string, details: NumberNotGreaterThanDetails) {
    return new NumberNotGreaterThanException(argumentName, details);
  }
}
