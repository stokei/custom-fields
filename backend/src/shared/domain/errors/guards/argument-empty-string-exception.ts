import { ValidationException } from '../base/validation-exception';

export interface ArgumentEmptyStringDetails {
  argumentName: string;
}

export class ArgumentEmptyStringException extends ValidationException<ArgumentEmptyStringDetails> {
  private constructor(details: ArgumentEmptyStringDetails) {
    super(
      `Guard: ${details.argumentName} is empty`,
      'ARGUMENT_EMPTY_STRING',
      details,
    );
  }

  static create(argumentName: string) {
    return new ArgumentEmptyStringException({ argumentName });
  }
}
