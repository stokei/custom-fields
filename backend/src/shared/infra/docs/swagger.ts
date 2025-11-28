import { VERSION } from '@/environments';
import { HttpStatus } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class Swagger {
  public static setup(app: NestExpressApplication): void {
    const document = new DocumentBuilder()
      .setTitle('Fields - Rest API')
      .setDescription('Rest API for Custom Fields')
      .setVersion(VERSION)
      .addGlobalResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized error',
      })
      .addGlobalResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Arguments validation error',
      })
      .addGlobalResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Entity not found error',
      })
      .addGlobalResponse({
        status: HttpStatus.CONFLICT,
        description: 'Some resource conflict error',
      })
      .addGlobalResponse({
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
