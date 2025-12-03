import { ExceptionCode } from '../base/exception-codes';
import { ValidationException } from '../base/validation-exception';

export class ArgumentEmptyArrayException extends ValidationException {
  private constructor(argumentName: string) {
    super(argumentName, `is empty`, ExceptionCode.ARGUMENT_EMPTY_ARRAY);
  }

  static create(argumentName: string) {
    return new ArgumentEmptyArrayException(argumentName);
  }
}
