export enum EnvironmentType {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}
export const ENVIRONMENT: EnvironmentType =
  (process.env.NODE_ENV as EnvironmentType) || EnvironmentType.DEVELOPMENT;

export const SERVER_PORT: number = process.env.SERVER_PORT ? +process.env.SERVER_PORT : 4000;
export const SERVER_HOST: string = process.env.SERVER_HOST || '0.0.0.0';
export const SERVER_URL: string = process.env.SERVER_URL || 'http://0.0.0.0:4000';

export const VERSION: string = process.env.VERSION || '';
export const DATABASE_URL: string = process.env.DATABASE_URL || '';
export const UNKEY_ROOT_KEY: string = process.env.UNKEY_ROOT_KEY || '';
