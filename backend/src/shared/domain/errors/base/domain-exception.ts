import { ExceptionCode } from './exception-codes';

export class DomainException<TDetails = Record<string, unknown>> extends Error {
  public readonly code: ExceptionCode;
  public readonly details?: TDetails[];

  protected constructor(
    message: string,
    code: ExceptionCode,
    details?: TDetails[],
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
