import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Modules } from './modules';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [CqrsModule.forRoot(), SharedModule, ...Modules],
  controllers: [],
  providers: [],
})
export class MainModule { }
