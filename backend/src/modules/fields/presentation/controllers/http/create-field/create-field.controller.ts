import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { REST_CONTROLLERS_URL_NAMES } from '@/constants/rest-controllers';
import { REST_VERSIONS } from '@/constants/rest-versions';
import { CreateFieldCommand } from '@/modules/fields/application/commands/create-field/create-field.command';
import { CreateFieldCommandResponse } from '@/modules/fields/application/commands/create-field/create-field.handler';
import { CreateFieldViewModel } from '@/modules/fields/application/viewmodels/create-field/create-field.viewmodel';
import { TenantContext } from '@/shared/domain/tenant-context/tenant-context';
import { UniqueEntityID } from '@/shared/domain/utils/unique-entity-id';
import { CommandBusService } from '@/shared/infra/command-bus/command-bus.service';
import { ApiWithTenantAuth } from '@/shared/infra/docs/decorators/auth/api-auth.decorator';
import { ApiDocCoreExceptionsResponse } from '@/shared/infra/docs/decorators/errors/core-exceptions';
import { Tenant } from '@/shared/infra/http/decorators/tenant/tenant.decorator';
import { HttpMethod } from '@/shared/infra/http/enums/http-method';
import { ApiKeyGuard } from '@/shared/infra/http/guards/api-key.guard';
import { HttpControllerBase } from '@/shared/presentation/base/http/controller-base';

import { ApiDocContextParam } from '../../../decorators/docs/api-doc-context-param.decorator';
import { CreateFieldDTO } from './create-field.dto';

@Controller({
  path: REST_CONTROLLERS_URL_NAMES.FIELDS.CREATE_FIELD,
  version: REST_VERSIONS.V1,
})
@ApiTags(REST_CONTROLLERS_URL_NAMES.FIELDS.DOCUMENTATION_TITLE)
@ApiWithTenantAuth()
export class CreateFieldController extends HttpControllerBase {
  constructor(
    private readonly commandBusService: CommandBusService<
      CreateFieldCommand,
      CreateFieldCommandResponse
    >,
  ) {
    super();
  }

  @Post()
  @UseGuards(ApiKeyGuard)
  @ApiOperation({
    summary: 'Create a new custom field',
    description:
      'Creates a new custom field inside the specified context of your application. ' +
      'This endpoint allows your SaaS to offer dynamic, user-defined fields—letting customers extend your data model, ' +
      'build flexible forms, configure workflows, and store custom attributes without schema changes.',
  })
  @ApiDocContextParam()
  @ApiBody({ type: CreateFieldDTO })
  @ApiCreatedResponse({
    description: 'Success',
    type: CreateFieldViewModel,
    example: CreateFieldViewModel.create({
      id: new UniqueEntityID().toString(),
    }),
  })
  @ApiDocCoreExceptionsResponse({
    path: REST_CONTROLLERS_URL_NAMES.FIELDS.CREATE_FIELD,
    method: HttpMethod.POST,
  })
  async createField(
    @Tenant() tenant: TenantContext,
    @Param('context') context: string,
    @Body() dto: CreateFieldDTO,
  ) {
    return this.rejectOrResolve(() =>
      this.commandBusService.execute(
        new CreateFieldCommand({
          ...dto,
          context,
          ...tenant,
        }),
      ),
    );
  }
}
