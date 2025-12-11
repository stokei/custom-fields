import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { REST_CONTROLLERS_URL_NAMES } from '@/constants/rest-controllers';
import { REST_VERSIONS } from '@/constants/rest-versions';
import { UpdateFieldOptionCommand } from '@/modules/fields/application/commands/update-field-option/update-field-option.command';
import { UpdateFieldOptionCommandResponse } from '@/modules/fields/application/commands/update-field-option/update-field-option.handler';
import { UpdateFieldOptionViewModel } from '@/modules/fields/application/viewmodels/update-field-option/update-field-option.viewmodel';
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
import { UpdateFieldOptionDTO } from './update-field-option.dto';

@Controller({
  path: REST_CONTROLLERS_URL_NAMES.FIELDS.OPTIONS.UPDATE_FIELD_OPTION,
  version: REST_VERSIONS.V1,
})
@ApiTags(REST_CONTROLLERS_URL_NAMES.FIELDS.OPTIONS.DOCUMENTATION_TITLE)
@ApiWithTenantAuth()
export class UpdateFieldOptionController extends HttpControllerBase {
  constructor(
    private readonly commandBusService: CommandBusService<
      UpdateFieldOptionCommand,
      UpdateFieldOptionCommandResponse
    >,
  ) {
    super();
  }

  @Put()
  @UseGuards(ApiKeyGuard)
  @ApiOperation({
    summary: 'Update a field option',
    description:
      'Updates the properties of an existing option belonging to a custom field. ' +
      'Use this endpoint to modify labels or other attributes of selectable values without recreating the field or ' +
      'altering your application schema. This allows your customers to refine dropdown choices, rename categories, or ' +
      'adjust business terminology in real time while preserving existing data and historical usage.',
  })
  @ApiDocContextParam()
  @ApiOkResponse({
    description: 'Success',
    type: UpdateFieldOptionViewModel,
    example: UpdateFieldOptionViewModel.create({
      value: 'some-value',
    }),
  })
  @ApiDocCoreExceptionsResponse({
    path: REST_CONTROLLERS_URL_NAMES.FIELDS.OPTIONS.UPDATE_FIELD_OPTION,
    method: HttpMethod.PUT,
  })
  async updateField(
    @Tenant() tenant: TenantContext,
    @Body() dto: UpdateFieldOptionDTO,
    @QueryParam('context') context: string,
    @QueryParam('key') key: string,
    @QueryParam('value') optionValue: string,
  ) {
    return this.rejectOrResolve(() =>
      this.commandBusService.execute(
        new UpdateFieldOptionCommand({
          field: {
            key,
            context,
            ...tenant,
          },
          option: {
            data: dto,
            where: {
              value: optionValue,
            },
          },
        }),
      ),
    );
  }
}
