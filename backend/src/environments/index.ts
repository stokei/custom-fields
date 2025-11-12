export const SERVER_PORT: number = process.env.SERVER_PORT
  ? +process.env.SERVER_PORT
  : 4000;
export const SERVER_HOST: string = process.env.SERVER_HOST || '0.0.0.0';
export const SERVER_URL: string =
  process.env.SERVER_URL || 'http://0.0.0.0:4000';

export const DATABASE_URL: string = process.env.DATABASE_URL || '';
