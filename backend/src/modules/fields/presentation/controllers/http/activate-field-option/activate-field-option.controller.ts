import { Controller, Put, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { REST_CONTROLLERS_URL_NAMES } from '@/constants/rest-controllers';
import { REST_VERSIONS } from '@/constants/rest-versions';
import { ActivateFieldOptionCommand } from '@/modules/fields/application/commands/activate-field-option/activate-field-option.command';
import { ActivateFieldOptionCommandResponse } from '@/modules/fields/application/commands/activate-field-option/activate-field-option.handler';
import { ActivateFieldOptionViewModel } from '@/modules/fields/application/viewmodels/activate-field-option/activate-field-option.viewmodel';
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
  path: REST_CONTROLLERS_URL_NAMES.FIELDS.OPTIONS.ACTIVATE_FIELD_OPTION,
  version: REST_VERSIONS.V1,
})
@ApiTags(REST_CONTROLLERS_URL_NAMES.FIELDS.OPTIONS.DOCUMENTATION_TITLE)
@ApiWithTenantAuth()
export class ActivateFieldOptionController extends HttpControllerBase {
  constructor(
    private readonly commandBusService: CommandBusService<
      ActivateFieldOptionCommand,
      ActivateFieldOptionCommandResponse
    >,
  ) {
    super();
  }

  @Put()
  @UseGuards(ApiKeyGuard)
  @ApiOperation({
    summary: 'Activate a field option',
    description:
      'Reactivates a previously disabled option of a custom field within the specified context. ' +
      'Use this endpoint to restore selectable values that were temporarily hidden or removed from forms, filters, or ' +
      'workflows. This allows your customers to reintroduce dropdown choices or category options without recreating ' +
      'the field or modifying your underlying schema.',
  })
  @ApiDocContextParam()
  @ApiOkResponse({
    description: 'Success',
    type: ActivateFieldOptionViewModel,
    example: ActivateFieldOptionViewModel.create({
      value: 'some-value',
    }),
  })
  @ApiDocCoreExceptionsResponse({
    path: REST_CONTROLLERS_URL_NAMES.FIELDS.OPTIONS.ACTIVATE_FIELD_OPTION,
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
        new ActivateFieldOptionCommand({
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
