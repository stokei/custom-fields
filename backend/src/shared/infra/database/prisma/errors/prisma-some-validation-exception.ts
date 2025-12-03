import { ExceptionCode } from '@/shared/domain/errors/base/exception-codes';
import { ValidationException } from '@/shared/domain/errors/base/validation-exception';

export class PrismaSomeValidationException extends ValidationException {
  private constructor(argumentName: string, message: string) {
    super(argumentName, message, ExceptionCode.VALIDATION_ERROR);
  }

  static create(argumentName: string, message: string) {
    return new PrismaSomeValidationException(argumentName, message);
  }
}
