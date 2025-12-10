import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthCheck } from '@nestjs/terminus';

import { REST_CONTROLLERS_URL_NAMES } from '@/constants/rest-controllers';
import { REST_VERSIONS } from '@/constants/rest-versions';

import { GetHealthCheckStatusViewModel } from '../../../application/queries/get-health-check-status/get-status.viewmodel';

@Controller({
  path: REST_CONTROLLERS_URL_NAMES.HEALTH_CHECKS.STATUS,
  version: REST_VERSIONS.V1,
})
@ApiTags(REST_CONTROLLERS_URL_NAMES.HEALTH_CHECKS.DOCUMENTATION_TITLE)
export class GetHealthCheckStatusController {
  @Get()
  @HealthCheck()
  @ApiOperation({
    summary: 'API Status',
  })
  @ApiOkResponse({
    description: 'Success',
    type: GetHealthCheckStatusViewModel,
    example: GetHealthCheckStatusViewModel.create({
      ok: true,
    }),
  })
  async getStatus() {
    return GetHealthCheckStatusViewModel.create({ ok: true });
  }
}
