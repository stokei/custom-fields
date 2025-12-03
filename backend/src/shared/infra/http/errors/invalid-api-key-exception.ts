import { DomainException } from '@/shared/domain/errors/base/domain-exception';
import { ExceptionCode } from '@/shared/domain/errors/base/exception-codes';

export class InvalidApiKeyException extends DomainException {
  private constructor() {
    super('Invalid Api Key', ExceptionCode.INVALID_API_KEY);
  }

  public static create() {
    return new InvalidApiKeyException();
  }
}
