import { HttpStatus } from '@nestjs/common';
import { DomainException } from './domain-exception';
import { ExceptionCode } from './exception-codes';
import { ExceptionType } from './exception-types';

export class ValidationException<
  TDetails = Record<string, unknown>,
> extends DomainException<TDetails> {
  public readonly type: ExceptionType;
  public static readonly TYPE: ExceptionType = ExceptionType.VALIDATION_ERROR;
  public static readonly HTTP_STATUS_CODE: HttpStatus = HttpStatus.BAD_REQUEST;
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

    this.type = ValidationException.TYPE;
  }
}
