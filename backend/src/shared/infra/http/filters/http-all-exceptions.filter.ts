import { DomainException } from '@/shared/domain/errors/base/domain-exception';
import { ExceptionType } from '@/shared/domain/errors/base/exception-types';
import { HttpException } from '@/shared/domain/errors/base/http-exception';
import { InternalException } from '@/shared/domain/errors/base/internal-exception';
import { NotFoundException } from '@/shared/domain/errors/base/not-found-exception';
import { ValidationException } from '@/shared/domain/errors/base/validation-exception';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException as NestHttpException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaRecordNotFoundException } from '../../database/prisma/errors/prisma-record-not-found-exception';
import { PrismaResourceAlreadyExistsException } from '../../database/prisma/errors/prisma-resource-already-exists-exception';
import { PrismaSomeValidationException } from '../../database/prisma/errors/prisma-some-validation-exception';
import { LoggerService } from '../../logger/logger.service';
import { HttpExceptionResponse } from '../errors/http-exception-response';

@Catch()
export class HttpAllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly loggerService: LoggerService) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const internalException = InternalException.create();
    const structuredErrorResponse = HttpExceptionResponse.create({
      statusCode: InternalException.HTTP_STATUS_CODE,
      path: request.url,
      method: request.method,
      error: {
        type: internalException.type,
        code: internalException.code,
        message: [internalException.message],
      },
    });

    if (exception instanceof ValidationException) {
      structuredErrorResponse.setStatusCode(ValidationException.HTTP_STATUS_CODE);
      structuredErrorResponse.setError({
        type: ValidationException.TYPE,
        code: exception.code,
        message: [exception.message],
        details: exception.details,
      });
    } else if (exception instanceof NotFoundException) {
      structuredErrorResponse.setStatusCode(NotFoundException.HTTP_STATUS_CODE);
      structuredErrorResponse.setError({
        type: NotFoundException.TYPE,
        code: exception.code,
        message: [exception.message],
        details: exception.details,
      });
    } else if (exception instanceof DomainException) {
      structuredErrorResponse.setStatusCode(DomainException.HTTP_STATUS_CODE);
      structuredErrorResponse.setError({
        type: DomainException.TYPE,
        code: exception.code,
        message: [exception.message],
        details: exception.details,
      });
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        const exceptionClass = PrismaResourceAlreadyExistsException.create(
          exception.meta?.target as string,
        );
        structuredErrorResponse.setStatusCode(
          PrismaResourceAlreadyExistsException.HTTP_STATUS_CODE,
        );
        structuredErrorResponse.setError({
          type: exceptionClass.type,
          code: exceptionClass.code,
          message: [exceptionClass.message],
          details: exceptionClass.details,
        });
      } else if (exception.code === 'P2025') {
        const exceptionClass = PrismaRecordNotFoundException.create(
          exception.meta?.target as string,
        );
        structuredErrorResponse.setStatusCode(PrismaRecordNotFoundException.HTTP_STATUS_CODE);
        structuredErrorResponse.setError({
          type: exceptionClass.type,
          code: exceptionClass.code,
          message: [exceptionClass.message],
          details: exceptionClass.details,
        });
      } else {
        const exceptionClass = PrismaSomeValidationException.create(
          exception.meta?.target as string,
          exception.message,
        );
        structuredErrorResponse.setStatusCode(PrismaSomeValidationException.HTTP_STATUS_CODE);
        structuredErrorResponse.setError({
          type: exceptionClass.type,
          code: exceptionClass.code,
          message: [exceptionClass.message],
          details: exceptionClass.details,
        });
      }
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      const exceptionClass = PrismaSomeValidationException.create(
        'ClientValidationError',
        exception.message,
      );
      structuredErrorResponse.setStatusCode(PrismaSomeValidationException.HTTP_STATUS_CODE);
      structuredErrorResponse.setError({
        type: exceptionClass.type,
        code: exceptionClass.code,
        message: [exceptionClass.message],
        details: exceptionClass.details,
      });
    } else if (exception instanceof NestHttpException) {
      structuredErrorResponse.setStatusCode(exception.getStatus());
      const errorResponse = exception.getResponse();
      const errorMessage =
        typeof errorResponse === 'string' ? errorResponse : errorResponse['message'];
      const exceptionClass = HttpException.create(
        errorMessage,
        typeof errorResponse === 'object' ? [errorResponse] : undefined,
      );
      structuredErrorResponse.setError({
        type: exceptionClass.type,
        code: exceptionClass.code,
        message: [errorMessage || 'Internal Server Error'],
        details: exceptionClass.details,
      });
    }
    const exceptionTypesThatCanBeLogged: ExceptionType[] = [
      ExceptionType.INTERNAL_ERROR,
      ExceptionType.HTTP_ERROR,
    ];
    const canLog = exceptionTypesThatCanBeLogged.includes(structuredErrorResponse.error.type);
    if (canLog) {
      this.loggerService.error(
        HttpAllExceptionsFilter.name,
        JSON.stringify(structuredErrorResponse),
      );
    }
    response.status(structuredErrorResponse.statusCode).json(structuredErrorResponse);
  }
}
