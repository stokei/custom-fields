import { ExceptionCode } from '../base/exception-codes';
import { ValidationException } from '../base/validation-exception';

export interface NumberNotInRangeDetails {
  num: number;
  min: number;
  max: number;
}

export class NumberNotInRangeException extends ValidationException<NumberNotInRangeDetails> {
  private constructor(argumentName: string, details: NumberNotInRangeDetails) {
    super(
      argumentName,
      `is not within range ${details.min} to ${details.max}.`,
      ExceptionCode.NUMBER_NOT_IN_RANGE,
      [details],
    );
  }

  static create(argumentName: string, details: NumberNotInRangeDetails) {
    return new NumberNotInRangeException(argumentName, details);
  }
}
