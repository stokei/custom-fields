import { DomainException } from './domain-exception';

export class ValidationException<
  TDetails = Record<string, unknown>,
> extends DomainException<TDetails> {
  protected constructor(message: string, code: string, details?: TDetails) {
    super(message, code, details);
  }
}
