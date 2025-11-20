import { ApiKeysServices } from './api-keys';
import { CommandBusService } from './command-bus/command-bus.service';
import { DatabaseServices } from './database';
import { PrismaClientService } from './database/prisma/prisma-client.service';
import { DomainEventBusService } from './event-bus/domain-event-bus.service';
import { LoggerService } from './logger/logger.service';
import { QueryBusService } from './query-bus/query-bus.service';

export const InfraProviders = [
  PrismaClientService,
  LoggerService,
  DomainEventBusService,
  CommandBusService,
  QueryBusService,
  ...ApiKeysServices,
  ...DatabaseServices,
];
