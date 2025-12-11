import { DomainException } from '@/shared/domain/errors/base/domain-exception';
import { ExceptionCode } from '@/shared/domain/errors/base/exception-codes';

export class FieldOptionAlreadyActivatedException extends DomainException {
  private constructor(value: string) {
    super(
      `Field option "${value}" already activated`,
      ExceptionCode.FIELD_OPTION_ALREADY_ACTIVATED,
    );
  }

  static create(value: string): FieldOptionAlreadyActivatedException {
    return new FieldOptionAlreadyActivatedException(value);
  }
}
