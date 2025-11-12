import { CommandBusService } from './command-bus/command-bus.service';
import { DomainEventBusService } from './event-bus/domain-event-bus.service';
import { LoggerService } from './logger/logger.service';
import { PrismaClientService } from './prisma/prisma-client.service';
import { QueryBusService } from './query-bus/query-bus.service';

export const InfraProviders = [
  PrismaClientService,
  LoggerService,
  DomainEventBusService,
  CommandBusService,
  QueryBusService,
];
