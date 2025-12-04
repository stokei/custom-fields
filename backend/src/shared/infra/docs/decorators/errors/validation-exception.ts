import { AlreadyExistsException } from '@/shared/domain/errors/base/already-exists-exception';
import { ExceptionCode } from '@/shared/domain/errors/base/exception-codes';
import { HttpMethod } from '@/shared/infra/http/enums/http-method';
import { ClassValidatorValidationException } from '@/shared/infra/http/errors/class-validator-validation-exception';
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
  class ValidationExceptionExample extends AlreadyExistsException {
    constructor() {
      super('Field', ExceptionCode.FIELD_ALREADY_EXISTS, 'field-id-123456');
    }
  }
  const validationException = new ValidationExceptionExample();

  const invalidParamsException = ClassValidatorValidationException.create([
    {
      field: 'label',
      value: '',
      constraints: {
        isNotEmpty: 'label should not be empty',
        isString: 'label must be a string',
      },
    },
    {
      field: 'key',
      value: '',
      constraints: {
        isNotEmpty: 'key should not be empty',
        isString: 'key must be a string',
      },
    },
  ]);

  return ApiBadRequestResponse({
    type: HttpExceptionResponse,
    description: 'Arguments validation error',
    examples: {
      InvalidParams: {
        summary: 'Invalid params exception',
        value: HttpExceptionResponse.create({
          statusCode: HttpStatus.BAD_REQUEST,
          path: path || 'path/to/resource',
          method: method || HttpMethod.GET,
          error: {
            type: invalidParamsException.type,
            code: invalidParamsException.code,
            message: invalidParamsException.messages,
            details: invalidParamsException.details,
          },
        }),
      },
      ValidationError: {
        summary: 'Validation Exception',
        value: HttpExceptionResponse.create({
          statusCode: HttpStatus.BAD_REQUEST,
          path: path || 'path/to/resource',
          method: method || HttpMethod.GET,
          error: {
            type: validationException.type,
            code: validationException.code,
            message: [validationException.message],
            details: validationException.details,
          },
        }),
      },
    },
  });
};
