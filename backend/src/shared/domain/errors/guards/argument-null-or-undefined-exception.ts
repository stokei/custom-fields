import { ValidationException } from '../base/validation-exception';

export interface ArgumentNullOrUndefinedDetails {
  argumentName: string;
}

export class ArgumentNullOrUndefinedException extends ValidationException<ArgumentNullOrUndefinedDetails> {
  private constructor(details: ArgumentNullOrUndefinedDetails) {
    super(
      `${details.argumentName} is null or undefined`,
      'ARGUMENT_NULL_OR_UNDEFINED',
      details,
    );
  }

  static create(argumentName: string) {
    return new ArgumentNullOrUndefinedException({ argumentName });
  }
}
