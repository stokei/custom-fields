import { FieldCreatedHandler } from './field-created/field-created.handler';
import { FieldRemovedHandler } from './field-removed/field-removed.handler';
import { FieldUpdatedHandler } from './field-updated/field-updated.handler';

export const Events = [FieldCreatedHandler, FieldRemovedHandler, FieldUpdatedHandler];
