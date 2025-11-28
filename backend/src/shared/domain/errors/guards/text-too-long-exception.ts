import { ValidationException } from '../base/validation-exception';

export interface TextTooLongDetails {
  maxLength: number;
  actualLength: number;
}

export class TextTooLongException extends ValidationException<TextTooLongDetails> {
  private constructor(argumentName: string, details: TextTooLongDetails) {
    super(
      argumentName,
      `Text is greater than ${details.maxLength} chars.`,
      'TEXT_TOO_LONG',
      details,
    );
  }

  static create(argumentName: string, details: TextTooLongDetails) {
    return new TextTooLongException(argumentName, details);
  }
}
