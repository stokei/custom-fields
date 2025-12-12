import { ExceptionCode } from '../base/exception-codes';
import { ValidationException } from '../base/validation-exception';

export interface ArgumentArrayLengthNotEqualExceptionDetails {
  expected: number;
  actual: number;
}

export class ArgumentArrayLengthNotEqualException extends ValidationException<ArgumentArrayLengthNotEqualExceptionDetails> {
  private constructor(argumentName: string, details: ArgumentArrayLengthNotEqualExceptionDetails) {
    super(
      argumentName,
      `Array must contain exactly ${details.expected} items, but received ${details.actual}.`,
      ExceptionCode.ARRAY_LENGTH_NOT_EQUAL,
      [details],
    );
  }

  static create(argumentName: string, details: ArgumentArrayLengthNotEqualExceptionDetails) {
    return new ArgumentArrayLengthNotEqualException(argumentName, details);
  }
}
