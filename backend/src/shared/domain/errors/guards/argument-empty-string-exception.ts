import { ValidationException } from '../base/validation-exception';

export class ArgumentEmptyStringException extends ValidationException {
  private constructor(argumentName: string) {
    super(argumentName, `is empty`, 'ARGUMENT_EMPTY_STRING');
  }

  static create(argumentName: string) {
    return new ArgumentEmptyStringException(argumentName);
  }
}
