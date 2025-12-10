import { DomainException } from '@/shared/domain/errors/base/domain-exception';
import { ExceptionCode } from '@/shared/domain/errors/base/exception-codes';

export class FieldAlreadyDeactivatedException extends DomainException {
  private constructor(key: string) {
    super(`Field "${key}" already deactivated`, ExceptionCode.FIELD_ALREADY_DEACTIVATED);
  }

  static create(key: string): FieldAlreadyDeactivatedException {
    return new FieldAlreadyDeactivatedException(key);
  }
}
