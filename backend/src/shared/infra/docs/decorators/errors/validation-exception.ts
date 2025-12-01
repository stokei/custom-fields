import { ExceptionCode } from '@/shared/domain/errors/base/exception-codes';
import { ValidationException } from '@/shared/domain/errors/base/validation-exception';
import { HttpMethod } from '@/shared/infra/http/enums/http-method';
import { HttpExceptionResponse } from '@/shared/infra/http/errors/http-exception-response';
import { HttpStatus } from '@nestjs/common';
import { ApiBadRequestResponse } from '@nestjs/swagger';

interface ApiDocValidationExceptionParams {
  path?: string;
  method?: HttpMethod;
}

export const ApiDocValidationExceptionResponse = ({
  path,
  method,
}: ApiDocValidationExceptionParams) => {
  class ValidationExceptionExample extends ValidationException {
    constructor() {
      super('name', 'Field', ExceptionCode.FIELD_ALREADY_EXISTS, [
        {
          someValue: 'some-detail',
        },
      ]);
    }
  }
  const exception = new ValidationExceptionExample();

  return ApiBadRequestResponse({
    type: HttpExceptionResponse,
    description: 'Arguments validation error',
    example: HttpExceptionResponse.create({
      statusCode: HttpStatus.BAD_REQUEST,
      path: path || 'path/to/resource',
      method: method || HttpMethod.GET,
      error: {
        type: ValidationException.TYPE,
        code: exception.code,
        message: [exception.message],
        details: exception.details,
      },
    }),
  });
};
