import { ExceptionCode } from '../base/exception-codes';
import { ValidationException } from '../base/validation-exception';

export interface ArgumentArrayMaxItemsExceptionDetails {
  max: number;
  actual: number;
}

export class ArgumentArrayMaxItemsException extends ValidationException<ArgumentArrayMaxItemsExceptionDetails> {
  private constructor(argumentName: string, details: ArgumentArrayMaxItemsExceptionDetails) {
    super(
      argumentName,
      `Array must contain no more than ${details.max} items, but received ${details.actual}.`,
      ExceptionCode.ARRAY_MAX_ITEMS,
      [details],
    );
  }

  static create(argumentName: string, details: ArgumentArrayMaxItemsExceptionDetails) {
    return new ArgumentArrayMaxItemsException(argumentName, details);
  }
}
