import { ExceptionCode } from '@/shared/domain/errors/base/exception-codes';
import { ValidationException } from '@/shared/domain/errors/base/validation-exception';

export class QueryParamMustBeBooleanException extends ValidationException {
  constructor(argumentName: string, value: any) {
    super(
      argumentName,
      `must be "true" or "false", received: ${value + ''}`,
      ExceptionCode.ARGUMENT_MUST_BE_BOOLEAN,
    );
  }

  static create(argumentName: string, value: any) {
    return new QueryParamMustBeBooleanException(argumentName, value);
  }
}
