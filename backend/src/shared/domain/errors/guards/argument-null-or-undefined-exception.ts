import { ExceptionCode } from '../base/exception-codes';
import { ValidationException } from '../base/validation-exception';

export class ArgumentNullOrUndefinedException extends ValidationException {
  private constructor(argumentName: string) {
    super(argumentName, `is null or undefined`, ExceptionCode.ARGUMENT_NULL_OR_UNDEFINED);
  }

  static create(argumentName: string) {
    return new ArgumentNullOrUndefinedException(argumentName);
  }
}
