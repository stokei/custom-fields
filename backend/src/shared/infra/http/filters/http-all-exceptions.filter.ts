import { DomainException } from '@/shared/domain/errors/base/domain-exception';
import { NotFoundException } from '@/shared/domain/errors/base/not-found-exception';
import { ValidationException } from '@/shared/domain/errors/base/validation-exception';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpAllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = exception.getResponse();

    const errorMessage =
      typeof errorResponse === 'string'
        ? errorResponse
        : errorResponse['message'] || 'Internal Server Error';
    const structuredErrorResponse = {
      error: {
        type: 'INTERNAL_ERROR',
        message: errorMessage,
      } as any,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };
    if (exception instanceof ValidationException) {
      structuredErrorResponse.statusCode = HttpStatus.BAD_REQUEST;
      structuredErrorResponse.error = {
        type: 'VALIDATION_ERROR',
        code: exception.code,
        message: exception.message,
        details: exception.details ?? null,
      };
    }
    if (exception instanceof NotFoundException) {
      structuredErrorResponse.statusCode = HttpStatus.NOT_FOUND;
      structuredErrorResponse.error = {
        type: 'NOT_FOUND',
        code: exception.code,
        message: exception.message,
        details: exception.details ?? null,
      };
    }
    if (exception instanceof DomainException) {
      structuredErrorResponse.statusCode = HttpStatus.CONFLICT;
      structuredErrorResponse.error = {
        type: 'DOMAIN_ERROR',
        code: exception.code,
        message: exception.message,
        details: exception.details ?? null,
      };
    }
    response
      .status(structuredErrorResponse.statusCode)
      .json(structuredErrorResponse);
  }
}
