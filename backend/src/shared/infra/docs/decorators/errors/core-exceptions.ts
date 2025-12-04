import { HttpMethod } from '@/shared/infra/http/enums/http-method';
import { applyDecorators } from '@nestjs/common';
import { ApiDocDomainExceptionResponse } from './domain-exception';
import { ApiDocNotFoundExceptionResponse } from './not-found-exception';
import { ApiDocValidationExceptionResponse } from './validation-exception';
import { ApiDocInternalExceptionResponse } from './internal-exception';

interface ApiDocCoreExceptionResponseParams {
  path?: string;
  method?: HttpMethod;
}

export const ApiDocCoreExceptionsResponse = (params: ApiDocCoreExceptionResponseParams) => {
  return applyDecorators(
    ApiDocDomainExceptionResponse(params),
    ApiDocNotFoundExceptionResponse(params),
    ApiDocValidationExceptionResponse(params),
    ApiDocInternalExceptionResponse(params),
  );
};
