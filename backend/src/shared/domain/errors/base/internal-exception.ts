import { HttpStatus } from '@nestjs/common';

import { ExceptionCode } from './exception-codes';
import { ExceptionType } from './exception-types';

export class InternalException<TDetails = Record<string, unknown>> extends Error {
  public readonly code: ExceptionCode;
  public readonly type: ExceptionType;
  public readonly details?: TDetails[];
  public static readonly TYPE: ExceptionType = ExceptionType.INTERNAL_ERROR;
  public static readonly HTTP_STATUS_CODE: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

  private constructor(message: string, details?: TDetails[]) {
    super(message);
    this.name = this.constructor.name;
    this.code = ExceptionCode.INTERNAL_ERROR;
    this.type = InternalException.TYPE;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);
  }

  static create<TDetails = Record<string, unknown>>(details?: TDetails[]) {
    return new InternalException<TDetails>('Internal Server Error', details);
  }
}
