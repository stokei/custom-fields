import { ActivateFieldController } from './activate-field/activate-field.controller';
import { ActivateFieldOptionController } from './activate-field-option/activate-field-option.controller';
import { CreateFieldController } from './create-field/create-field.controller';
import { CreateFieldOptionController } from './create-field-option/create-field-option.controller';
import { DeactivateFieldController } from './deactivate-field/deactivate-field.controller';
import { DeactivateFieldOptionController } from './deactivate-field-option/deactivate-field-option.controller';
import { GetAllFieldsByContextController } from './get-all-fields-by-context/get-all-fields-by-context.controller';
import { UpdateFieldController } from './update-field/update-field.controller';
import { UpdateFieldOptionController } from './update-field-option/update-field-option.controller';

export const HttpControllers = [
  CreateFieldController,
  UpdateFieldController,
  ActivateFieldController,
  DeactivateFieldController,
  GetAllFieldsByContextController,
  CreateFieldOptionController,
  ActivateFieldOptionController,
  DeactivateFieldOptionController,
  UpdateFieldOptionController,
];
