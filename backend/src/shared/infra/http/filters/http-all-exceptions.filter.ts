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
import { ValidationError as ClassValidatorValidationError } from 'class-validator';

@Catch()
export class HttpAllExceptionsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const structuredErrorResponse = {
      error: {
        type: 'INTERNAL_ERROR',
        message: 'Internal Server Error',
      } as any,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };

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
          code: 'UNIQUE_CONSTRAINT',
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
          code: 'RECORD_NOT_FOUND',
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
          : (errorResponse as any)['message'] || 'Internal Server Error';

      structuredErrorResponse.error = {
        type: 'HTTP_ERROR',
        message: errorMessage,
        details:
          typeof errorResponse === 'object' ? (errorResponse as any) : null,
      };

      const isClassValidatorError =
        Array.isArray((errorResponse as any)?.message) &&
        (errorResponse as any).message[0]?.constraints;
      //console.log(exception);
      if (isClassValidatorError) {
        const errors = (errorResponse as any)
          ?.message as ClassValidatorValidationError[];

        const details = errors.map((err) => ({
          field: err.property,
          constraints: err.constraints,
        }));
        structuredErrorResponse.statusCode = HttpStatus.BAD_REQUEST;
        structuredErrorResponse.error = {
          type: 'VALIDATION_ERROR',
          code: 'VALIDATION_ERROR',
          message: 'Invalid request body',
          details,
        };
      }
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
