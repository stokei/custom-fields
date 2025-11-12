import { Commands } from './commands';
import { Queries } from './queries';
import { Sagas } from './sagas';
import { Services } from './services';

export const ApplicationProviders = [
  ...Commands,
  ...Queries,
  ...Sagas,
  ...Services,
];
