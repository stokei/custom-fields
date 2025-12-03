/** @jest-config-loader ts-node */

import type { Config } from 'jest';

const config: Config = {
  detectOpenHandles: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/e2e/(.*)$': '<rootDir>/e2e/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  clearMocks: true,
  resetMocks: true,
};
export default config;
