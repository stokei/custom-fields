import { Controller, Put, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { REST_CONTROLLERS_URL_NAMES } from '@/constants/rest-controllers';
import { REST_VERSIONS } from '@/constants/rest-versions';
import { ActivateFieldCommand } from '@/modules/fields/application/commands/activate-field/activate-field.command';
import { ActivateFieldCommandResponse } from '@/modules/fields/application/commands/activate-field/activate-field.handler';
import { ActivateFieldViewModel } from '@/modules/fields/application/viewmodels/activate-field/activate-field.viewmodel';
import { TenantContext } from '@/shared/domain/tenant-context/tenant-context';
import { UniqueEntityID } from '@/shared/domain/utils/unique-entity-id';
import { CommandBusService } from '@/shared/infra/command-bus/command-bus.service';
import { ApiWithTenantAuth } from '@/shared/infra/docs/decorators/auth/api-auth.decorator';
import { ApiDocCoreExceptionsResponse } from '@/shared/infra/docs/decorators/errors/core-exceptions';
import { QueryParam } from '@/shared/infra/http/decorators/query-params/query-param.decorator';
import { Tenant } from '@/shared/infra/http/decorators/tenant/tenant.decorator';
import { HttpMethod } from '@/shared/infra/http/enums/http-method';
import { ApiKeyGuard } from '@/shared/infra/http/guards/api-key.guard';
import { HttpControllerBase } from '@/shared/presentation/base/http/controller-base';

@Controller({
  path: REST_CONTROLLERS_URL_NAMES.FIELDS.ACTIVATE_FIELD,
  version: REST_VERSIONS.V1,
})
@ApiTags(REST_CONTROLLERS_URL_NAMES.FIELDS.DOCUMENTATION_TITLE)
@ApiWithTenantAuth()
export class ActivateFieldController extends HttpControllerBase {
  constructor(
    private readonly commandBusService: CommandBusService<
      ActivateFieldCommand,
      ActivateFieldCommandResponse
    >,
  ) {
    super();
  }

  @Put()
  @UseGuards(ApiKeyGuard)
  @ApiOperation({
    summary: 'Activate field',
  })
  @ApiOkResponse({
    description: 'Success',
    type: ActivateFieldViewModel,
    example: ActivateFieldViewModel.create({
      id: new UniqueEntityID().toString(),
    }),
  })
  @ApiDocCoreExceptionsResponse({
    path: REST_CONTROLLERS_URL_NAMES.FIELDS.ACTIVATE_FIELD,
    method: HttpMethod.PATCH,
  })
  async activateField(
    @Tenant() tenant: TenantContext,
    @QueryParam('context') context: string,
    @QueryParam('key') key: string,
  ) {
    return this.rejectOrResolve(() =>
      this.commandBusService.execute(
        new ActivateFieldCommand({
          key,
          context,
          tenantId: tenant.tenantId,
          organizationId: tenant.organizationId,
        }),
      ),
    );
  }
}
