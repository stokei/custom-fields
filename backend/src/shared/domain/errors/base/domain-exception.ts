export class DomainException<TDetails = Record<string, unknown>> extends Error {
  public readonly code: string;
  public readonly details?: TDetails;

  protected constructor(message: string, code: string, details?: TDetails) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
