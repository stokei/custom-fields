import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { REST_CONTROLLERS_URL_NAMES } from '@/constants/rest-controllers';
import { REST_VERSIONS } from '@/constants/rest-versions';
import { UpdateFieldCommand } from '@/modules/fields/application/commands/update-field/update-field.command';
import { UpdateFieldCommandResponse } from '@/modules/fields/application/commands/update-field/update-field.handler';
import { UpdateFieldViewModel } from '@/modules/fields/application/viewmodels/update-field/update-field.viewmodel';
import { TenantContext } from '@/shared/domain/tenant-context/tenant-context';
import { CommandBusService } from '@/shared/infra/command-bus/command-bus.service';
import { ApiWithTenantAuth } from '@/shared/infra/docs/decorators/auth/api-auth.decorator';
import { ApiDocCoreExceptionsResponse } from '@/shared/infra/docs/decorators/errors/core-exceptions';
import { QueryParam } from '@/shared/infra/http/decorators/query-params/query-param.decorator';
import { Tenant } from '@/shared/infra/http/decorators/tenant/tenant.decorator';
import { HttpMethod } from '@/shared/infra/http/enums/http-method';
import { ApiKeyGuard } from '@/shared/infra/http/guards/api-key.guard';
import { HttpControllerBase } from '@/shared/presentation/base/http/controller-base';

import { ApiDocContextParam } from '../../../decorators/docs/api-doc-context-param.decorator';
import { UpdateFieldDTO } from './update-field.dto';

@Controller({
  path: REST_CONTROLLERS_URL_NAMES.FIELDS.UPDATE_FIELD,
  version: REST_VERSIONS.V1,
})
@ApiTags(REST_CONTROLLERS_URL_NAMES.FIELDS.DOCUMENTATION_TITLE)
@ApiWithTenantAuth()
export class UpdateFieldController extends HttpControllerBase {
  constructor(
    private readonly commandBusService: CommandBusService<
      UpdateFieldCommand,
      UpdateFieldCommandResponse
    >,
  ) {
    super();
  }

  @Put()
  @UseGuards(ApiKeyGuard)
  @ApiOperation({
    summary: 'Update an existing custom field',
    description:
      'Updates the configuration of an existing custom field identified by its context and key. ' +
      'Use this endpoint to evolve how your customers interact with your product over time—changing labels, ' +
      'validation rules, required behavior, grouping, ordering, and other display properties—without performing ' +
      'database schema migrations or redeploying your application.',
  })
  @ApiDocContextParam()
  @ApiOkResponse({
    description: 'Success',
    type: UpdateFieldViewModel,
    example: UpdateFieldViewModel.create({
      key: 'field-key',
    }),
  })
  @ApiDocCoreExceptionsResponse({
    path: REST_CONTROLLERS_URL_NAMES.FIELDS.UPDATE_FIELD,
    method: HttpMethod.PUT,
  })
  async updateField(
    @Tenant() tenant: TenantContext,
    @Body() dto: UpdateFieldDTO,
    @QueryParam('context') context: string,
    @QueryParam('key') key: string,
  ) {
    return this.rejectOrResolve(() =>
      this.commandBusService.execute(
        new UpdateFieldCommand({
          data: dto,
          where: {
            key,
            context,
            ...tenant,
          },
        }),
      ),
    );
  }
}
