import { CommandBase } from '@/shared/application/base/command-base';
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

@Injectable()
export class CommandBusService<TCommand extends CommandBase, TResponse = any> {
  constructor(private readonly commandBus: CommandBus) { }

  async execute(command: TCommand): Promise<TResponse> {
    return await this.commandBus.execute(command);
  }
}
