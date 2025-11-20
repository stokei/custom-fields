import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Modules } from './modules';
import { SharedModule } from './shared/shared.module';
import { SwaggerModule } from '@nestjs/swagger';

@Module({
  imports: [CqrsModule.forRoot(), SwaggerModule, SharedModule, ...Modules],
  controllers: [],
  providers: [],
})
export class MainModule { }
