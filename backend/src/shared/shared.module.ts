import { Global, Module } from '@nestjs/common';
import { InfraProviders } from './infra';

const Providers = [...InfraProviders];

@Global()
@Module({
  providers: Providers,
  exports: Providers,
})
export class SharedModule { }
