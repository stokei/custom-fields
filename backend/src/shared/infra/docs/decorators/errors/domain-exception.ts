import { DomainException } from '@/shared/domain/errors/base/domain-exception';
import { ExceptionCode } from '@/shared/domain/errors/base/exception-codes';
import { HttpMethod } from '@/shared/infra/http/enums/http-method';
import { HttpExceptionResponse } from '@/shared/infra/http/errors/http-exception-response';
import { ApiConflictResponse } from '@nestjs/swagger';

interface ApiDocDomainExceptionParams {
  path?: string;
  method?: HttpMethod;
}

export const ApiDocDomainExceptionResponse = ({ path, method }: ApiDocDomainExceptionParams) => {
  class DomainExceptionExample extends DomainException {
    constructor() {
      super('name', ExceptionCode.DOMAIN_ERROR, [
        {
          someValue: 'some-detail',
        },
      ]);
    }
  }
  const exception = new DomainExceptionExample();

  return ApiConflictResponse({
    type: HttpExceptionResponse,
    description: 'Some resource conflict error',
    example: HttpExceptionResponse.create({
      statusCode: DomainException.HTTP_STATUS_CODE,
      path: path || 'path/to/resource',
      method: method || HttpMethod.GET,
      error: {
        type: DomainException.TYPE,
        code: exception.code,
        message: [exception.message],
        details: exception.details,
      },
    }),
  });
};
