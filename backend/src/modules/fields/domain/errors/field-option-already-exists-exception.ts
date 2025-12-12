import { AlreadyExistsException } from '@/shared/domain/errors/base/already-exists-exception';
import { ExceptionCode } from '@/shared/domain/errors/base/exception-codes';

export class FieldOptionAlreadyExistsException extends AlreadyExistsException {
  private constructor(value: string) {
    super('FieldOption', ExceptionCode.FIELD_OPTION_ALREADY_EXISTS, value);
  }

  static create(value: string): FieldOptionAlreadyExistsException {
    return new FieldOptionAlreadyExistsException(value);
  }
}
