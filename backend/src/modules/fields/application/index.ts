import { Commands } from './commands';
import { Queries } from './queries';
import { Sagas } from './sagas';

export const ApplicationProviders = [...Commands, ...Queries, ...Sagas];
