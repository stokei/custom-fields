import { NotFoundException } from '@/shared/domain/errors/base/not-found-exception';
import { HttpMethod } from '@/shared/infra/http/enums/http-method';
import { HttpExceptionResponse } from '@/shared/infra/http/errors/http-exception-response';
import { HttpStatus } from '@nestjs/common';
import { ApiNotFoundResponse } from '@nestjs/swagger';

interface ApiDocNotFoundExceptionParams {
  path?: string;
  method?: HttpMethod;
}

export const ApiDocNotFoundExceptionResponse = ({
  path,
  method,
}: ApiDocNotFoundExceptionParams) => {
  class NotFoundExceptionExample extends NotFoundException {
    constructor() {
      super('Users', 'user-id-1234');
    }
  }
  const exception = new NotFoundExceptionExample();

  return ApiNotFoundResponse({
    type: HttpExceptionResponse,
    description: 'Entity not found error',
    example: HttpExceptionResponse.create({
      statusCode: HttpStatus.NOT_FOUND,
      path: path || 'path/to/resource',
      method: method || HttpMethod.GET,
      error: {
        type: NotFoundException.TYPE,
        code: exception.code,
        message: [exception.message],
        details: exception.details,
      },
    }),
  });
};
