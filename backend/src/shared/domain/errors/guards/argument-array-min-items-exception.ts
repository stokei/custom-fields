import { ExceptionCode } from '../base/exception-codes';
import { ValidationException } from '../base/validation-exception';

export interface ArgumentArrayMinItemsExceptionDetails {
  min: number;
  actual: number;
}

export class ArgumentArrayMinItemsException extends ValidationException<ArgumentArrayMinItemsExceptionDetails> {
  private constructor(argumentName: string, details: ArgumentArrayMinItemsExceptionDetails) {
    super(
      argumentName,
      `Array must contain at least ${details.min} items, but received ${details.actual}.`,
      ExceptionCode.ARRAY_MIN_ITEMS,
      [details],
    );
  }

  static create(argumentName: string, details: ArgumentArrayMinItemsExceptionDetails) {
    return new ArgumentArrayMinItemsException(argumentName, details);
  }
}
