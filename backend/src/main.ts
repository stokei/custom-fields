import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
import { SERVER_HOST, SERVER_PORT, SERVER_URL } from './environments';
import { Logger, VersioningType } from '@nestjs/common';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create(MainModule, {
    bodyParser: false,
    abortOnError: false,
  });

  app.enableCors({
    origin: '*',
  });

  app.enableVersioning({
    type: VersioningType.URI,
  });

  await app.listen(SERVER_PORT, SERVER_HOST);

  logger.log(`Application is running on: ${SERVER_URL}`);
}

bootstrap().catch(() => {
  logger.error('Failed to start the application');
  process.exit(1);
});
