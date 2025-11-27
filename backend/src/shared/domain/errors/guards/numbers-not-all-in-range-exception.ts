import { ValidationException } from '../base/validation-exception';

export interface NumbersNotAllInRangeDetails {
  argumentName: string;
  numbers: number[];
  min: number;
  max: number;
}

export class NumbersNotAllInRangeException extends ValidationException<NumbersNotAllInRangeDetails> {
  private constructor(details: NumbersNotAllInRangeDetails) {
    super(
      `${details.argumentName} is not within the range ${details.min} to ${details.max}.`,
      'NUMBERS_NOT_ALL_IN_RANGE',
      details,
    );
  }

  static create(
    argumentName: string,
    numbers: number[],
    min: number,
    max: number,
  ) {
    return new NumbersNotAllInRangeException({
      argumentName,
      numbers,
      min,
      max,
    });
  }
}
