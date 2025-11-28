import { ValidationException } from '../base/validation-exception';

export interface NumbersNotAllInRangeDetails {
  numbers: number[];
  min: number;
  max: number;
}

export class NumbersNotAllInRangeException extends ValidationException<NumbersNotAllInRangeDetails> {
  private constructor(
    argumentName: string,
    details: NumbersNotAllInRangeDetails,
  ) {
    super(
      argumentName,
      `is not within the range ${details.min} to ${details.max}.`,
      'NUMBERS_NOT_ALL_IN_RANGE',
      details,
    );
  }

  static create(argumentName: string, details: NumbersNotAllInRangeDetails) {
    return new NumbersNotAllInRangeException(argumentName, details);
  }
}
