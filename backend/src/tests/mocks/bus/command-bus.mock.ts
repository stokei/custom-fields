import { CommandBusService } from '@/shared/infra/command-bus/command-bus.service';
import { Provider } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

export class CommandBusMock {
  execute = jest.fn();

  asNestProvider(): Partial<CommandBus> {
    return {
      execute: this.execute,
    };
  }
}

export const CommandBusServiceMockProvider: Provider = {
  provide: CommandBusService,
  useFactory: () => new CommandBusMock(),
};
