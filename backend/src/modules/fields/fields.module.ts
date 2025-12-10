import { Module } from '@nestjs/common';

import { ApplicationProviders } from './application';
import { DomainProviders } from './domain';
import { InfraProviders } from './infra';
import { PresentationControllers } from './presentation';

@Module({
  imports: [],
  controllers: PresentationControllers,
  providers: [...ApplicationProviders, ...DomainProviders, ...InfraProviders],
})
export class FieldsModule {}
