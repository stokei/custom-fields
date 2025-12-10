import { HttpStatus } from '@nestjs/common';

import { REST_CONTROLLERS_URL_NAMES } from '@/constants/rest-controllers';
import { createRequestTesting } from '@/e2e/stubs/create-request-testing';
import { AppTesting, createAppTesting } from '@/e2e/stubs/create-testing-module';
import { GetHealthCheckStatusViewModel } from '@/modules/health-checks/presentation/application/queries/get-health-check-status/get-status.viewmodel';

describe('Health Checks', () => {
  let app: AppTesting;

  beforeEach(async () => {
    app = await createAppTesting();
  });

  it(`${REST_CONTROLLERS_URL_NAMES.HEALTH_CHECKS.STATUS} (GET)`, () => {
    return createRequestTesting(app)
      .get(REST_CONTROLLERS_URL_NAMES.HEALTH_CHECKS.STATUS)
      .expect(HttpStatus.OK)
      .expect(GetHealthCheckStatusViewModel.create({ ok: true }).toJSON());
  });
});
