import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { App } from 'supertest/types';

import { MainModule } from '@/main.module';

export type AppTesting = INestApplication<App>;
export const createAppTesting = async (): Promise<AppTesting> => {
  const moduleTesting = await Test.createTestingModule({
    imports: [MainModule],
  }).compile();

  const app = moduleTesting.createNestApplication();
  await app.init();
  return app;
};
