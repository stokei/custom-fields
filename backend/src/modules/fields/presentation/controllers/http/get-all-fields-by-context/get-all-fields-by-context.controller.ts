import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { REST_CONTROLLERS_URL_NAMES } from '@/constants/rest-controllers';
import { REST_VERSIONS } from '@/constants/rest-versions';
import { GetAllFieldsByContextQueryResponse } from '@/modules/fields/application/queries/get-all-fields-by-context/get-all-fields-by-context.handler';
import { GetAllFieldsByContextQuery } from '@/modules/fields/application/queries/get-all-fields-by-context/get-all-fields-by-context.query';
import { GetAllFieldsByContextViewModel } from '@/modules/fields/application/viewmodels/get-all-fields-by-context/get-all-fields-by-context.viewmodel';
import { TenantContext } from '@/shared/domain/tenant-context/tenant-context';
import { ApiWithTenantAuth } from '@/shared/infra/docs/decorators/auth/api-auth.decorator';
import { Tenant } from '@/shared/infra/http/decorators/tenant/tenant.decorator';
import { ApiKeyGuard } from '@/shared/infra/http/guards/api-key.guard';
import { QueryBusService } from '@/shared/infra/query-bus/query-bus.service';
import { HttpControllerBase } from '@/shared/presentation/base/http/controller-base';
import { createSingleSelectFieldEntityStub } from '@/tests/stubs/fields/entities/single-select.stub';
import { createTextFieldEntityStub } from '@/tests/stubs/fields/entities/text.stub';

@Controller({
  path: REST_CONTROLLERS_URL_NAMES.FIELDS.GET_ALL_FIELDS_BY_CONTEXT,
  version: REST_VERSIONS.V1,
})
@ApiTags(REST_CONTROLLERS_URL_NAMES.FIELDS.DOCUMENTATION_TITLE)
@ApiWithTenantAuth()
export class GetAllFieldsByContextController extends HttpControllerBase {
  constructor(
    private readonly queryBusService: QueryBusService<
      GetAllFieldsByContextQuery,
      GetAllFieldsByContextQueryResponse
    >,
  ) {
    super();
  }

  @Get()
  @UseGuards(ApiKeyGuard)
  @ApiOperation({
    summary: 'Get all fields by context',
  })
  @ApiOkResponse({
    description: 'Sucess',
    type: GetAllFieldsByContextViewModel,
    example: GetAllFieldsByContextViewModel.create('USERS', [
      createTextFieldEntityStub({ context: 'USERS', order: 0 }),
      createSingleSelectFieldEntityStub({ context: 'USERS', order: 1 }),
    ]),
  })
  async createField(
    @Tenant() tenant: TenantContext,
    @Param('context') context: string,
    @Query('context') context: string,
  ) {
    return this.rejectOrResolve(() =>
      this.queryBusService.execute(
        new GetAllFieldsByContextQuery({
          context,
          tenantId: tenant.tenantId,
          organizationId: tenant.organizationId,
        }),
      ),
    );
  }
}
