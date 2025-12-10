import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { VERSION } from '@/environments';

export class Swagger {
  public static setup(app: NestExpressApplication): void {
    const document = new DocumentBuilder()
      .setTitle('Custom Fields API')
      .setDescription(
        'A flexible, API-first service for creating, managing, and integrating dynamic custom fields into your SaaS. ' +
          'Use this API to build configurable forms, extend your data models, and let your customers personalize attributes ' +
          'without database migrations or code changes.',
      )
      .setVersion(VERSION)
      .addApiKey(
        {
          type: 'apiKey',
          name: 'x-api-key',
          in: 'header',
          description:
            'Your API Key for authenticating requests to the Custom Fields API. ' +
            'Every request must include a valid API key with sufficient permissions.',
        },
        'ApiKeyAuth',
      )
      .addGlobalParameters({
        name: 'x-organization-id',
        in: 'header',
        required: true,
        description:
          'The unique identifier of the organization (tenant) owning the fields. ' +
          'This ensures full isolation and multi-tenant data separation across your SaaS.',
      })
      .build();

    const createDocument = SwaggerModule.createDocument(app, document);
    SwaggerModule.setup('/docs', app, createDocument, {
      jsonDocumentUrl: 'openapi.json',
      customfavIcon: '/favicon.ico',
      customSiteTitle: 'Custom Fields API',
    });
  }
}
