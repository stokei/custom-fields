import { FieldActivatedHandler } from './field-activated/field-activated.handler';
import { FieldCreatedHandler } from './field-created/field-created.handler';
import { FieldDeactivatedHandler } from './field-deactivated/field-deactivated.handler';
import { FieldUpdatedHandler } from './field-updated/field-updated.handler';

export const Events = [
  FieldCreatedHandler,
  FieldActivatedHandler,
  FieldDeactivatedHandler,
  FieldUpdatedHandler,
];
