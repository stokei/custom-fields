import { ActivateFieldController } from './activate-field/activate-field.controller';
import { CreateFieldController } from './create-field/create-field.controller';
import { DeactivateFieldController } from './deactivate-field/deactivate-field.controller';
import { GetAllFieldsByContextController } from './get-all-fields-by-context/get-all-fields-by-context.controller';
import { UpdateFieldController } from './update-field/update-field.controller';

export const HttpControllers = [
  CreateFieldController,
  UpdateFieldController,
  ActivateFieldController,
  DeactivateFieldController,
  GetAllFieldsByContextController,
];
