import { Controller, Put, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { REST_CONTROLLERS_URL_NAMES } from '@/constants/rest-controllers';
import { REST_VERSIONS } from '@/constants/rest-versions';
import { DeactivateFieldOptionCommand } from '@/modules/fields/application/commands/deactivate-field-option/deactivate-field-option.command';
import { DeactivateFieldOptionCommandResponse } from '@/modules/fields/application/commands/deactivate-field-option/deactivate-field-option.handler';
import { DeactivateFieldOptionViewModel } from '@/modules/fields/application/viewmodels/deactivate-field-option/deactivate-field-option.viewmodel';
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

@Controller({
  path: REST_CONTROLLERS_URL_NAMES.FIELDS.OPTIONS.DEACTIVATE_FIELD_OPTION,
  version: REST_VERSIONS.V1,
})
@ApiTags(REST_CONTROLLERS_URL_NAMES.FIELDS.OPTIONS.DOCUMENTATION_TITLE)
@ApiWithTenantAuth()
export class DeactivateFieldOptionController extends HttpControllerBase {
  constructor(
    private readonly commandBusService: CommandBusService<
      DeactivateFieldOptionCommand,
      DeactivateFieldOptionCommandResponse
    >,
  ) {
    super();
  }

  @Put()
  @UseGuards(ApiKeyGuard)
  @ApiOperation({
    summary: 'Deactivate a field option',
    description:
      'Disables a selectable option of a custom field within the specified context. ' +
      'Use this endpoint when an option should no longer appear in dropdowns, filters, or workflows, while keeping its ' +
      'historical usage intact. This allows your customers to phase out values, enforce new business rules, or simplify ' +
      'their forms without deleting the field or altering your underlying schema.',
  })
  @ApiDocContextParam()
  @ApiOkResponse({
    description: 'Success',
    type: DeactivateFieldOptionViewModel,
    example: DeactivateFieldOptionViewModel.create({
      value: 'some-value',
    }),
  })
  @ApiDocCoreExceptionsResponse({
    path: REST_CONTROLLERS_URL_NAMES.FIELDS.OPTIONS.DEACTIVATE_FIELD_OPTION,
    method: HttpMethod.PUT,
  })
  async activateFieldOption(
    @Tenant() tenant: TenantContext,
    @QueryParam('context') context: string,
    @QueryParam('key') key: string,
    @QueryParam('value') optionValue: string,
  ) {
    return this.rejectOrResolve(() =>
      this.commandBusService.execute(
        new DeactivateFieldOptionCommand({
          field: {
            key,
            context,
            ...tenant,
          },
          option: {
            value: optionValue,
          },
        }),
      ),
    );
  }
}
