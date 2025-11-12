import { ICommand } from '@nestjs/cqrs';

export type CommandBase = ICommand;

export abstract class CommandHandlerBase<
  TCommand extends CommandBase,
  TResponse = any,
> {
  abstract execute(command: TCommand): TResponse;
}
