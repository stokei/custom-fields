import { MainModule } from '@/main.module';
import { Test, TestingModuleBuilder } from '@nestjs/testing';

export const createTestingModule = (): TestingModuleBuilder => {
  const module = Test.createTestingModule({
    imports: [MainModule],
  });
  return module;
};
