import { MainModule } from '@/main.module';
import { Test } from '@nestjs/testing';

export const createAppTesting = async () => {
  const moduleTesting = await Test.createTestingModule({
    imports: [MainModule],
  }).compile();

  const app = moduleTesting.createNestApplication();
  await app.init();
  return app;
};
