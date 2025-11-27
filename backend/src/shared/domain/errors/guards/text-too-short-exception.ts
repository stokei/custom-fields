import { ValidationException } from '../base/validation-exception';

export interface TextTooShortDetails {
  minLength: number;
  actualLength: number;
}

export class TextTooShortException extends ValidationException<TextTooShortDetails> {
  private constructor(details: TextTooShortDetails) {
    super(
      `Text is not at least ${details.minLength} chars.`,
      'TEXT_TOO_SHORT',
      details,
    );
  }

  static create(numChars: number, actualLength: number) {
    return new TextTooShortException({
      minLength: numChars,
      actualLength,
    });
  }
}
