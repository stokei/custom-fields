import { Test, TestingModuleBuilder } from '@nestjs/testing';

import { MainModule } from '@/main.module';

export const createTestingModule = (): TestingModuleBuilder => {
  const module = Test.createTestingModule({
    imports: [MainModule],
  });
  return module;
};
