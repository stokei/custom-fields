import { ActivateFieldHandler } from './activate-field/activate-field.handler';
import { CreateFieldHandler } from './create-field/create-field.handler';
import { DeactivateFieldHandler } from './deactivate-field/deactivate-field.handler';
import { UpdateFieldHandler } from './update-field/update-field.handler';

export const Commands = [
  CreateFieldHandler,
  ActivateFieldHandler,
  DeactivateFieldHandler,
  UpdateFieldHandler,
];
