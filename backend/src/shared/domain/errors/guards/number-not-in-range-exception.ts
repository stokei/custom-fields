import { ValidationException } from '../base/validation-exception';

export interface NumberNotInRangeDetails {
  argumentName: string;
  num: number;
  min: number;
  max: number;
}

export class NumberNotInRangeException extends ValidationException<NumberNotInRangeDetails> {
  private constructor(details: NumberNotInRangeDetails) {
    super(
      `${details.argumentName} is not within range ${details.min} to ${details.max}.`,
      'NUMBER_NOT_IN_RANGE',
      details,
    );
  }

  static create(argumentName: string, num: number, min: number, max: number) {
    return new NumberNotInRangeException({ argumentName, num, min, max });
  }
}
