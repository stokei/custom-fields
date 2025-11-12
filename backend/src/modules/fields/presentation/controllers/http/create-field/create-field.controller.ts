import { CommandBusService } from '@/shared/infra/command-bus/command-bus.service';
import { Body, Controller, Headers, Post } from '@nestjs/common';
import { CreateFieldCommand } from '@/modules/fields/application/commands/create-field/create-field.command';
import { REST_CONTROLLERS_URL_NAMES } from '@/constants/rest-controllers';
import { REST_VERSIONS } from '@/constants/rest-versions';
import { CreateFieldDTO } from '../../../dtos/create-field.dto';

@Controller({
  path: REST_CONTROLLERS_URL_NAMES.FIELDS.CREATE_FIELD,
  version: REST_VERSIONS.V1,
})
export class CreateFieldController {
  constructor(
    private readonly commandBusService: CommandBusService<CreateFieldCommand>,
  ) { }

  @Post()
  async createField(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: CreateFieldDTO,
  ) {
    return this.commandBusService.execute(
      new CreateFieldCommand({ tenantId, ...dto }),
    );
  }
}
