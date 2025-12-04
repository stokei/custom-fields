import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SERVER_HOST, SERVER_PORT, SERVER_URL } from './environments';
import { MainModule } from './main.module';
import { Swagger } from './shared/infra/docs/swagger';
import { HttpAllExceptionsFilter } from './shared/infra/http/filters/http-all-exceptions.filter';
import { ClassValidatiorValidationPipe } from './shared/infra/http/pipes/validation.pipe';
import { LoggerService } from './shared/infra/logger/logger.service';
import { join } from 'path';

const logger = new Logger('Bootstrap');

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
  const loggerService = app.get(LoggerService);
  app.useGlobalPipes(ClassValidatiorValidationPipe.create());
  app.useGlobalFilters(new HttpAllExceptionsFilter(loggerService));
  app.useStaticAssets(join(__dirname, '..', 'assets'));

  Swagger.setup(app);
  await app.listen(SERVER_PORT, SERVER_HOST);

  logger.log(`Application is running on: ${SERVER_URL}`);
}

bootstrap().catch(() => {
  logger.error('Failed to start the application');
  process.exit(1);
});
