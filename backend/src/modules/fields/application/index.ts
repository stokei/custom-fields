import { Commands } from './commands';
import { Events } from './events';
import { Queries } from './queries';
import { Sagas } from './sagas';

export const ApplicationProviders = [...Commands, ...Queries, ...Events, ...Sagas];
