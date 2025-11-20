import { REST_CONTROLLERS_URL_NAMES } from '@/constants/rest-controllers';
import { REST_VERSIONS } from '@/constants/rest-versions';
import { CreateFieldCommand } from '@/modules/fields/application/commands/create-field/create-field.command';
import { CreateFieldViewModel } from '@/modules/fields/application/commands/create-field/create-field.viewmodel';
import { TenantContext } from '@/shared/domain/tenant-context/tenant-context';
import { CommandBusService } from '@/shared/infra/command-bus/command-bus.service';
import { ApiWithTenantAuth } from '@/shared/infra/docs/decorators/api-auth.decorator';
import { Tenant } from '@/shared/infra/http/decorators/tenant.decorator';
import { ApiKeyGuard } from '@/shared/infra/http/guards/api-key.guard';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateFieldDTO } from '../../../dtos/create-field.dto';

@Controller({
  path: REST_CONTROLLERS_URL_NAMES.FIELDS.CREATE_FIELD,
  version: REST_VERSIONS.V1,
})
@ApiTags(REST_CONTROLLERS_URL_NAMES.FIELDS.DOCUMENTATION_TITLE)
@ApiWithTenantAuth()
export class CreateFieldController {
  constructor(
    private readonly commandBusService: CommandBusService<CreateFieldCommand>,
  ) { }

  @Post()
  @UseGuards(ApiKeyGuard)
  @ApiOperation({
    summary: 'Criar um campo',
  })
  @ApiBody({ type: CreateFieldDTO })
  @ApiCreatedResponse({
    description: 'Sucesso',
    type: CreateFieldViewModel,
  })
  async createField(
    @Tenant() tenant: TenantContext,
    @Body() dto: CreateFieldDTO,
  ) {
    return this.commandBusService.execute(
      new CreateFieldCommand({
        ...dto,
        tenantId: tenant.tenantId,
        organizationId: tenant.organizationId,
        active: true,
      }),
    );
  }
}
