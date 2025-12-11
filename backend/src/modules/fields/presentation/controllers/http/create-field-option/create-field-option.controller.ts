import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { REST_CONTROLLERS_URL_NAMES } from '@/constants/rest-controllers';
import { REST_VERSIONS } from '@/constants/rest-versions';
import { CreateFieldOptionCommand } from '@/modules/fields/application/commands/create-field-option/create-field-option.command';
import { CreateFieldOptionCommandResponse } from '@/modules/fields/application/commands/create-field-option/create-field-option.handler';
import { CreateFieldOptionViewModel } from '@/modules/fields/application/viewmodels/create-field-option/create-field-option.viewmodel';
import { TenantContext } from '@/shared/domain/tenant-context/tenant-context';
import { CommandBusService } from '@/shared/infra/command-bus/command-bus.service';
import { ApiWithTenantAuth } from '@/shared/infra/docs/decorators/auth/api-auth.decorator';
import { ApiDocCoreExceptionsResponse } from '@/shared/infra/docs/decorators/errors/core-exceptions';
import { Tenant } from '@/shared/infra/http/decorators/tenant/tenant.decorator';
import { HttpMethod } from '@/shared/infra/http/enums/http-method';
import { ApiKeyGuard } from '@/shared/infra/http/guards/api-key.guard';
import { HttpControllerBase } from '@/shared/presentation/base/http/controller-base';

import { ApiDocContextParam } from '../../../decorators/docs/api-doc-context-param.decorator';
import { CreateFieldOptionDTO } from './create-field-option.dto';

@Controller({
  path: REST_CONTROLLERS_URL_NAMES.FIELDS.OPTIONS.CREATE_FIELD_OPTION,
  version: REST_VERSIONS.V1,
})
@ApiTags(REST_CONTROLLERS_URL_NAMES.FIELDS.OPTIONS.DOCUMENTATION_TITLE)
@ApiWithTenantAuth()
export class CreateFieldOptionController extends HttpControllerBase {
  constructor(
    private readonly commandBusService: CommandBusService<
      CreateFieldOptionCommand,
      CreateFieldOptionCommandResponse
    >,
  ) {
    super();
  }

  @Post()
  @UseGuards(ApiKeyGuard)
  @ApiOperation({
    summary: 'Create a new option for a custom field',
    description:
      'Creates a new option for an existing custom field within the specified context. ' +
      'Use this endpoint to extend selectable values (such as statuses, categories, or tags) without redeploying your ' +
      'application. This allows your customers to customize dropdowns and other select-type fields in real time, ' +
      'while your SaaS keeps the data model stable and schema-free.',
  })
  @ApiDocContextParam()
  @ApiBody({ type: CreateFieldOptionDTO })
  @ApiCreatedResponse({
    description: 'Successfully created field option',
    type: CreateFieldOptionViewModel,
    example: CreateFieldOptionViewModel.create({
      value: 'some-value',
    }),
  })
  @ApiDocCoreExceptionsResponse({
    path: REST_CONTROLLERS_URL_NAMES.FIELDS.OPTIONS.CREATE_FIELD_OPTION,
    method: HttpMethod.POST,
  })
  async createFieldOption(
    @Tenant() tenant: TenantContext,
    @Param('context') context: string,
    @Param('key') key: string,
    @Body() dto: CreateFieldOptionDTO,
  ) {
    return this.rejectOrResolve(() =>
      this.commandBusService.execute(
        new CreateFieldOptionCommand({
          option: dto,
          field: {
            key,
            context,
            ...tenant,
          },
        }),
      ),
    );
  }
}
