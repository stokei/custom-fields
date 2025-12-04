import { DomainEventBusService } from '@/shared/infra/event-bus/domain-event-bus.service';

export const domainEventBusServiceMock: jest.Mocked<Partial<DomainEventBusService>> = {
  publish: jest.fn(),
  publishAll: jest.fn(),
};
