import { ActivateFieldController } from './activate-field/activate-field.controller';
import { CreateFieldController } from './create-field/create-field.controller';
import { DeactivateFieldController } from './deactivate-field/deactivate-field.controller';
import { GetAllFieldsByContextController } from './get-all-fields-by-context/get-all-fields-by-context.controller';

export const HttpControllers = [
  CreateFieldController,
  ActivateFieldController,
  DeactivateFieldController,
  GetAllFieldsByContextController,
];
