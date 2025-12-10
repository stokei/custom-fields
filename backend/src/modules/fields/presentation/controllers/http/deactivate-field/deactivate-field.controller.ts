import { Controller, Put, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { REST_CONTROLLERS_URL_NAMES } from '@/constants/rest-controllers';
import { REST_VERSIONS } from '@/constants/rest-versions';
import { DeactivateFieldCommand } from '@/modules/fields/application/commands/deactivate-field/deactivate-field.command';
import { DeactivateFieldCommandResponse } from '@/modules/fields/application/commands/deactivate-field/deactivate-field.handler';
import { DeactivateFieldViewModel } from '@/modules/fields/application/viewmodels/deactivate-field/deactivate-field.viewmodel';
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

import { ApiDocContextParam } from '../../../decorators/docs/api-doc-context-param.decorator';

@Controller({
  path: REST_CONTROLLERS_URL_NAMES.FIELDS.DEACTIVATE_FIELD,
  version: REST_VERSIONS.V1,
})
@ApiTags(REST_CONTROLLERS_URL_NAMES.FIELDS.DOCUMENTATION_TITLE)
@ApiWithTenantAuth()
export class DeactivateFieldController extends HttpControllerBase {
  constructor(
    private readonly commandBusService: CommandBusService<
      DeactivateFieldCommand,
      DeactivateFieldCommandResponse
    >,
  ) {
    super();
  }

  @Put()
  @UseGuards(ApiKeyGuard)
  @ApiOperation({
    summary: 'Deactivate field',
  })
  @ApiDocContextParam()
  @ApiOkResponse({
    description: 'Success',
    type: DeactivateFieldViewModel,
    example: DeactivateFieldViewModel.create({
      id: new UniqueEntityID().toString(),
    }),
  })
  @ApiDocCoreExceptionsResponse({
    path: REST_CONTROLLERS_URL_NAMES.FIELDS.DEACTIVATE_FIELD,
    method: HttpMethod.PUT,
  })
  async deactivateField(
    @Tenant() tenant: TenantContext,
    @QueryParam('context') context: string,
    @QueryParam('key') key: string,
  ) {
    return this.rejectOrResolve(() =>
      this.commandBusService.execute(
        new DeactivateFieldCommand({
          key,
          context,
          ...tenant,
        }),
      ),
    );
  }
}
