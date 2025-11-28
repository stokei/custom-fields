import { VERSION } from '@/environments';
import { HttpStatus } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionResponse } from '../http/errors/http-exception-response';
import { ExceptionCode } from '@/shared/domain/errors/base/exception-codes';

export class Swagger {
  public static setup(app: NestExpressApplication): void {
    const document = new DocumentBuilder()
      .setTitle('Fields - Rest API')
      .setDescription('Rest API for Custom Fields')
      .setVersion(VERSION)
      .addGlobalResponse({
        example: HttpExceptionResponse.create({
          statusCode: HttpStatus.UNAUTHORIZED,
          path: 'path/to/resource',
          method: 'GET',
          error: {
            type: 'UNAUTHORIZED',
            code: 'UNAUTHORIZED',
            message: 'Unauthorized error',
          } as any,
        }),
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized error',
      })
      .addGlobalResponse({
        example: HttpExceptionResponse.create({
          statusCode: HttpStatus.BAD_REQUEST,
          path: 'path/to/resource',
          method: 'GET',
          error: {
            type: ExceptionCode.VALIDATION_ERROR,
            code: ExceptionCode.VALIDATION_ERROR,
            message: 'Arguments validation error',
            details: [
              {
                somevalue: 'some detail value',
              },
            ],
          } as any,
        }),
        status: HttpStatus.BAD_REQUEST,
        description: 'Arguments validation error',
      })
      .addGlobalResponse({
        example: HttpExceptionResponse.create({
          statusCode: HttpStatus.NOT_FOUND,
          path: 'path/to/resource',
          method: 'GET',
          error: {
            type: ExceptionCode.NOT_FOUND,
            code: ExceptionCode.NOT_FOUND,
            message: 'Entity not found error',
            details: [
              {
                somevalue: 'some detail value',
              },
            ],
          } as any,
        }),
        status: HttpStatus.NOT_FOUND,
        description: 'Entity not found error',
      })
      .addGlobalResponse({
        example: HttpExceptionResponse.create({
          statusCode: HttpStatus.CONFLICT,
          path: 'path/to/resource',
          method: 'GET',
          error: {
            type: ExceptionCode.DOMAIN_ERROR,
            code: ExceptionCode.DOMAIN_ERROR,
            message: 'Some resource conflict error',
            details: [
              {
                somevalue: 'some detail value',
              },
            ],
          } as any,
        }),
        status: HttpStatus.CONFLICT,
        description: 'Some resource conflict error',
      })
      .addGlobalResponse({
        example: HttpExceptionResponse.create({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          path: 'path/to/resource',
          method: 'GET',
          error: {
            type: ExceptionCode.INTERNAL_ERROR,
            code: ExceptionCode.INTERNAL_ERROR,
            message: 'Internal server error',
            details: [
              {
                somevalue: 'some detail value',
              },
            ],
          } as any,
        }),
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error',
      })
      .addApiKey(
        {
          type: 'apiKey',
          name: 'x-api-key',
          in: 'header',
          description: 'Sua API Key gerada',
        },
        'ApiKeyAuth',
      )
      .addGlobalParameters({
        name: 'x-organization-id',
        in: 'header',
        description: 'Organization ID da organização responsável pelos campos',
      })
      .build();

    const createDocument = SwaggerModule.createDocument(app, document);
    SwaggerModule.setup('/docs', app, createDocument, {
      jsonDocumentUrl: 'openapi.json',
    });
  }
}
