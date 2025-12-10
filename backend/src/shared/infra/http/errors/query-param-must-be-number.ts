import { ExceptionCode } from '@/shared/domain/errors/base/exception-codes';
import { ValidationException } from '@/shared/domain/errors/base/validation-exception';

export class QueryParamMustBeNumberException extends ValidationException {
  constructor(argumentName: string, value: any) {
    super(
      argumentName,
      `must be a number, received: ${value + ''}`,
      ExceptionCode.ARGUMENT_MUST_BE_NUMBER,
    );
  }

  static create(argumentName: string, value: any) {
    return new QueryParamMustBeNumberException(argumentName, value);
  }
}
