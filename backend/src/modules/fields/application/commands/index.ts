import { ActivateFieldHandler } from './activate-field/activate-field.handler';
import { ActivateFieldOptionHandler } from './activate-field-option/activate-field-option.handler';
import { CreateFieldHandler } from './create-field/create-field.handler';
import { CreateFieldOptionHandler } from './create-field-option/create-field-option.handler';
import { DeactivateFieldHandler } from './deactivate-field/deactivate-field.handler';
import { DeactivateFieldOptionHandler } from './deactivate-field-option/deactivate-field-option.handler';
import { UpdateFieldHandler } from './update-field/update-field.handler';
import { UpdateFieldOptionHandler } from './update-field-option/update-field-option.handler';

export const Commands = [
  CreateFieldHandler,
  ActivateFieldHandler,
  DeactivateFieldHandler,
  UpdateFieldHandler,
  CreateFieldOptionHandler,
  ActivateFieldOptionHandler,
  DeactivateFieldOptionHandler,
  UpdateFieldOptionHandler,
];
