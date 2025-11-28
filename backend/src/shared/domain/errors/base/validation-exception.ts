import { DomainException } from './domain-exception';

export class ValidationException<
  TDetails = Record<string, unknown>,
> extends DomainException<TDetails> {
  protected constructor(
    argumentName: string,
    message: string,
    code: string,
    details?: TDetails,
  ) {
    super(`[${argumentName}] ${message}`, code, details);
  }
}
