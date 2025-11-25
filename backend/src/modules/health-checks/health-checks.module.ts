import { Module } from '@nestjs/common';
import { PresentationControllers } from './presentation';

@Module({
  imports: [],
  controllers: PresentationControllers,
  providers: [],
})
export class HealthChecksModule { }
