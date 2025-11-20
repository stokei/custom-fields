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
      .addApiKey(
        {
          type: 'apiKey',
          name: 'x-organization-id',
          in: 'header',
          description:
            'Organization ID da organização responsável pelos campos',
        },
        'OrgIdAuth',
      )
      .build();

    const createDocument = SwaggerModule.createDocument(app, document);

    const httpAdapter = app.getHttpAdapter();
    const instance = httpAdapter.getInstance();
    instance.get('/openapi.json', (req, res) => {
      res.json(createDocument);
    });

    SwaggerModule.setup('/docs', app, createDocument);
  }
}
