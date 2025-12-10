import { DomainException } from '@/shared/domain/errors/base/domain-exception';
import { ExceptionCode } from '@/shared/domain/errors/base/exception-codes';

export class FieldAlreadyActivatedException extends DomainException {
  private constructor(key: string) {
    super(`Field "${key}" already activated`, ExceptionCode.FIELD_ALREADY_ACTIVATED);
  }

  static create(key: string): FieldAlreadyActivatedException {
    return new FieldAlreadyActivatedException(key);
  }
}
