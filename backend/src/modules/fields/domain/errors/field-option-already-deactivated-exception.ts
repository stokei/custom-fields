import { DomainException } from '@/shared/domain/errors/base/domain-exception';
import { ExceptionCode } from '@/shared/domain/errors/base/exception-codes';

export class FieldOptionAlreadyDeactivatedException extends DomainException {
  private constructor(value: string) {
    super(
      `Field option "${value}" already deactivated`,
      ExceptionCode.FIELD_OPTION_ALREADY_DEACTIVATED,
    );
  }

  static create(value: string): FieldOptionAlreadyDeactivatedException {
    return new FieldOptionAlreadyDeactivatedException(value);
  }
}
