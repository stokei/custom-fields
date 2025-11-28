import { DomainException } from './domain-exception';
import { ExceptionCode } from './exception-codes';

export class ValidationException<
  TDetails = Record<string, unknown>,
> extends DomainException<TDetails> {
  protected constructor(
    argumentName: string,
    message: string | string[],
    code: ExceptionCode,
    details?: TDetails[],
  ) {
    const argument = argumentName ? `[${argumentName}] ` : '';
    const isArrayMessage = Array.isArray(message);
    const messageFormatted = isArrayMessage
      ? message.map((value) => `${argument}${value}`).join('; ')
      : `${argument}${message}`;
    super(messageFormatted, code, details);
  }
}
