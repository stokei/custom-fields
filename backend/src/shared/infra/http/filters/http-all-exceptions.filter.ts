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
import { Prisma } from '@prisma/client';
import { HttpExceptionResponse } from '../errors/http-exception-response';
import { ExceptionCode } from '@/shared/domain/errors/base/exception-codes';

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
        type: 'INTERNAL_ERROR',
        code: 'INTERNAL_ERROR',
        message: 'Internal Server Error',
      } as any,
    });

    // ─────────────────────────────────────────────
    // 1) CLASS-VALIDATOR ERRORS
    // ─────────────────────────────────────────────
    if (exception instanceof ValidationException) {
      structuredErrorResponse.statusCode = HttpStatus.BAD_REQUEST;
      structuredErrorResponse.error = {
        type: 'VALIDATION_ERROR',
        code: exception.code,
        message: exception.message,
        details: exception.details ?? null,
      };
    } else if (exception instanceof NotFoundException) {
      structuredErrorResponse.statusCode = HttpStatus.NOT_FOUND;
      structuredErrorResponse.error = {
        type: 'NOT_FOUND',
        code: exception.code,
        message: exception.message,
        details: exception.details ?? null,
      };
    } else if (exception instanceof DomainException) {
      structuredErrorResponse.statusCode = HttpStatus.CONFLICT;
      structuredErrorResponse.error = {
        type: 'DOMAIN_ERROR',
        code: exception.code,
        message: exception.message,
        details: exception.details ?? null,
      };
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        structuredErrorResponse.statusCode = HttpStatus.CONFLICT;
        structuredErrorResponse.error = {
          type: 'DOMAIN_ERROR',
          code: ExceptionCode.UNIQUE_CONSTRAINT,
          message: 'Resource already exists (unique constraint violation).',
          details: {
            prismaCode: exception.code,
            target: (exception.meta as any)?.target,
          },
        };
      } else if (exception.code === 'P2025') {
        structuredErrorResponse.statusCode = HttpStatus.NOT_FOUND;
        structuredErrorResponse.error = {
          type: 'NOT_FOUND',
          code: ExceptionCode.RECORD_NOT_FOUND,
          message: 'Record not found.',
          details: {
            prismaCode: exception.code,
            cause: exception.meta,
          },
        };
      } else {
        structuredErrorResponse.statusCode = HttpStatus.BAD_REQUEST;
        structuredErrorResponse.error = {
          type: 'VALIDATION_ERROR',
          code: exception.code,
          message: exception.message,
          details: exception.meta,
        };
      }
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      structuredErrorResponse.statusCode = HttpStatus.BAD_REQUEST;
      structuredErrorResponse.error = {
        type: 'VALIDATION_ERROR',
        code: 'VALIDATION_ERROR',
        message: exception.message,
      };
    } else if (exception instanceof HttpException) {
      structuredErrorResponse.statusCode = exception.getStatus();
      const errorResponse = exception.getResponse();
      const errorMessage =
        typeof errorResponse === 'string'
          ? errorResponse
          : errorResponse['message'];

      structuredErrorResponse.error = {
        type: 'HTTP_ERROR',
        message: errorMessage || 'Internal Server Error',
        details: typeof errorResponse === 'object' ? errorResponse : null,
      };
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
