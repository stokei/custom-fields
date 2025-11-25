import { REST_CONTROLLERS_URL_NAMES } from '@/constants/rest-controllers';
import { GetHealthCheckStatusViewModel } from '@/modules/health-checks/presentation/application/queries/get-health-check-status/get-status.viewmodel';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createAppTesting } from '@/e2e/stubs/create-testing-module';

describe('Health Checks', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await createAppTesting();
  });

  it(`${REST_CONTROLLERS_URL_NAMES.HEALTH_CHECKS.STATUS} (GET)`, () => {
    return request(app.getHttpServer())
      .get(REST_CONTROLLERS_URL_NAMES.HEALTH_CHECKS.STATUS)
      .expect(200)
      .expect(GetHealthCheckStatusViewModel.create({ ok: true }).toJSON());
  });
});
