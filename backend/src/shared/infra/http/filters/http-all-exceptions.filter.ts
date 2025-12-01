import { DomainException } from '@/shared/domain/errors/base/domain-exception';
import { ExceptionCode } from '@/shared/domain/errors/base/exception-codes';
import { ExceptionType } from '@/shared/domain/errors/base/exception-types';
import { NotFoundException } from '@/shared/domain/errors/base/not-found-exception';
import { ValidationException } from '@/shared/domain/errors/base/validation-exception';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { HttpExceptionResponse } from '../errors/http-exception-response';

@Catch()
export class HttpAllExceptionsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const structuredErrorResponse = HttpExceptionResponse.create({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      path: request.url,
      method: request.method,
      error: {
        type: ExceptionType.INTERNAL_ERROR,
        code: ExceptionCode.INTERNAL_ERROR,
        message: ['Internal Server Error'],
      },
    });

    if (exception instanceof ValidationException) {
      structuredErrorResponse.setStatusCode(HttpStatus.BAD_REQUEST);
      structuredErrorResponse.setError({
        type: ExceptionType.VALIDATION_ERROR,
        code: exception.code,
        message: [exception.message],
        details: exception.details,
      });
    } else if (exception instanceof NotFoundException) {
      structuredErrorResponse.setStatusCode(HttpStatus.NOT_FOUND);
      structuredErrorResponse.setError({
        type: ExceptionType.NOT_FOUND,
        code: exception.code,
        message: [exception.message],
        details: exception.details,
      });
    } else if (exception instanceof DomainException) {
      structuredErrorResponse.setStatusCode(HttpStatus.CONFLICT);
      structuredErrorResponse.setError({
        type: ExceptionType.DOMAIN_ERROR,
        code: exception.code,
        message: [exception.message],
        details: exception.details,
      });
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        structuredErrorResponse.setStatusCode(HttpStatus.CONFLICT);
        structuredErrorResponse.setError({
          type: ExceptionType.DOMAIN_ERROR,
          code: ExceptionCode.UNIQUE_CONSTRAINT,
          message: ['Resource already exists (unique constraint violation).'],
          details: [
            {
              prismaCode: exception.code,
              target: (exception.meta as any)?.target,
            },
          ],
        });
      } else if (exception.code === 'P2025') {
        structuredErrorResponse.setStatusCode(HttpStatus.NOT_FOUND);
        structuredErrorResponse.setError({
          type: ExceptionType.NOT_FOUND,
          code: ExceptionCode.RECORD_NOT_FOUND,
          message: ['Record not found.'],
          details: [
            {
              prismaCode: exception.code,
              cause: exception.meta,
            },
          ],
        });
      } else {
        structuredErrorResponse.setStatusCode(HttpStatus.BAD_REQUEST);
        structuredErrorResponse.setError({
          type: ExceptionType.VALIDATION_ERROR,
          code: ExceptionCode.VALIDATION_ERROR,
          message: [exception.message],
          details: [exception.meta],
        });
      }
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      structuredErrorResponse.setStatusCode(HttpStatus.BAD_REQUEST);
      structuredErrorResponse.setError({
        type: ExceptionType.VALIDATION_ERROR,
        code: ExceptionCode.VALIDATION_ERROR,
        message: [exception.message],
      });
    } else if (exception instanceof HttpException) {
      structuredErrorResponse.setStatusCode(exception.getStatus());
      const errorResponse = exception.getResponse();
      const errorMessage =
        typeof errorResponse === 'string'
          ? errorResponse
          : errorResponse['message'];

      structuredErrorResponse.setError({
        type: ExceptionType.HTTP_ERROR,
        code: ExceptionCode.HTTP_ERROR,
        message: [errorMessage || 'Internal Server Error'],
        details:
          typeof errorResponse === 'object' ? [errorResponse] : undefined,
      });
    }
    structuredErrorResponse.error.message = Array.isArray(
      structuredErrorResponse.error.message,
    )
      ? structuredErrorResponse.error.message
      : [structuredErrorResponse.error.message];
    response
      .status(structuredErrorResponse.statusCode)
      .json(structuredErrorResponse);
  }
}
