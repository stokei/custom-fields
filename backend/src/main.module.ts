import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SwaggerModule } from '@nestjs/swagger';
import { Modules } from './modules';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [CqrsModule.forRoot(), SwaggerModule, SharedModule, ...Modules],
  controllers: [],
  providers: [],
})
export class MainModule {}
