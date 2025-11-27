import { ValidationException } from '../base/validation-exception';

export interface TextTooLongDetails {
  maxLength: number;
  actualLength: number;
}

export class TextTooLongException extends ValidationException<TextTooLongDetails> {
  private constructor(details: TextTooLongDetails) {
    super(
      `Text is greater than ${details.maxLength} chars.`,
      'TEXT_TOO_LONG',
      details,
    );
  }

  static create(numChars: number, actualLength: number) {
    return new TextTooLongException({
      maxLength: numChars,
      actualLength,
    });
  }
}
