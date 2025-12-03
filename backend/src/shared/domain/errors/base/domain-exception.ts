import { HttpStatus } from '@nestjs/common';
import { ExceptionCode } from './exception-codes';
import { ExceptionType } from './exception-types';

export class DomainException<TDetails = Record<string, unknown>> extends Error {
  public readonly code: ExceptionCode;
  public readonly type: ExceptionType;
  public readonly details?: TDetails[];
  public static readonly TYPE: ExceptionType = ExceptionType.DOMAIN_ERROR;
  public static readonly HTTP_STATUS_CODE: HttpStatus = HttpStatus.CONFLICT;

  protected constructor(
    message: string,
    code: ExceptionCode,
    details?: TDetails[],
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.type = DomainException.TYPE;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
