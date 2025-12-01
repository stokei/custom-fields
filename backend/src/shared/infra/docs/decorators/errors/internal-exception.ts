import { ExceptionCode } from '@/shared/domain/errors/base/exception-codes';
import { ExceptionType } from '@/shared/domain/errors/base/exception-types';
import { HttpMethod } from '@/shared/infra/http/enums/http-method';
import { HttpExceptionResponse } from '@/shared/infra/http/errors/http-exception-response';
import { HttpStatus } from '@nestjs/common';
import { ApiInternalServerErrorResponse } from '@nestjs/swagger';

interface ApiDocInternalExceptionParams {
  path?: string;
  method?: HttpMethod;
}

export const ApiDocInternalExceptionResponse = ({
  path,
  method,
}: ApiDocInternalExceptionParams) => {
  return ApiInternalServerErrorResponse({
    type: HttpExceptionResponse,
    description: 'Internal server error',
    example: HttpExceptionResponse.create({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      path: path || 'path/to/resource',
      method: method || HttpMethod.GET,
      error: {
        type: ExceptionType.INTERNAL_ERROR,
        code: ExceptionCode.INTERNAL_ERROR,
        message: ['Internal server error'],
        details: [
          {
            somevalue: 'some detail value',
          },
        ],
      },
    }),
  });
};
