import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
import { SERVER_HOST, SERVER_PORT, SERVER_URL } from './environments';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { HttpAllExceptionsFilter } from './shared/infra/http/filters/http-all-exceptions.filter';
import { Swagger } from './shared/infra/docs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationException } from './shared/domain/errors/base/validation-exception';

const logger = new Logger('Bootstrap');
class ClassValidatorValidationError extends ValidationException {
  constructor(details?: any) {
    super(
      'Validation failed',
      'Invalid request body',
      'VALIDATION_ERROR',
      details,
    );
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(MainModule, {
    abortOnError: false,
  });
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory(errors) {
        const details = errors.map((err) => ({
          field: err.property,
          constraints: err.constraints,
        }));
        return new ClassValidatorValidationError(details);
      },
    }),
  );
  app.useGlobalFilters(new HttpAllExceptionsFilter());

  Swagger.setup(app);
  await app.listen(SERVER_PORT, SERVER_HOST);

  logger.log(`Application is running on: ${SERVER_URL}`);
}

bootstrap().catch(() => {
  logger.error('Failed to start the application');
  process.exit(1);
});
