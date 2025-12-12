import { AlreadyExistsException } from '@/shared/domain/errors/base/already-exists-exception';
import { ExceptionCode } from '@/shared/domain/errors/base/exception-codes';

export class FieldAlreadyExistsException extends AlreadyExistsException {
  private constructor(key: string) {
    super('Field', ExceptionCode.FIELD_ALREADY_EXISTS, key);
  }

  static create(key: string): FieldAlreadyExistsException {
    return new FieldAlreadyExistsException(key);
  }
}
