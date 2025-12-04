import { VERSION } from '@/environments';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class Swagger {
  public static setup(app: NestExpressApplication): void {
    const document = new DocumentBuilder()
      .setTitle('Fields - Rest API')
      .setDescription('Rest API for Custom Fields')
      .setVersion(VERSION)
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
        required: true,
        description: 'Organization ID da organização responsável pelos campos',
      })
      .build();

    const createDocument = SwaggerModule.createDocument(app, document);
    SwaggerModule.setup('/docs', app, createDocument, {
      jsonDocumentUrl: 'openapi.json',
    });
  }
}
