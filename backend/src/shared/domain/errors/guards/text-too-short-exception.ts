import { ExceptionCode } from '../base/exception-codes';
import { ValidationException } from '../base/validation-exception';

export interface TextTooShortDetails {
  minLength: number;
  actualLength: number;
}

export class TextTooShortException extends ValidationException<TextTooShortDetails> {
  private constructor(argumentName: string, details: TextTooShortDetails) {
    super(
      argumentName,
      `Text is not at least ${details.minLength} chars.`,
      ExceptionCode.TEXT_TOO_SHORT,
      [details],
    );
  }

  static create(argumentName: string, details: TextTooShortDetails) {
    return new TextTooShortException(argumentName, details);
  }
}
