/** @jest-config-loader ts-node */

import type { Config } from 'jest';

const config: Config = {
  detectOpenHandles: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['./src/**/*.(t|j)s'],
  coverageDirectory: './coverage',
  coverageReporters: ['html', 'lcov', 'text-summary'],
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/e2e/(.*)$': '<rootDir>/e2e/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  clearMocks: true,
  resetMocks: true,
};

export default config;
