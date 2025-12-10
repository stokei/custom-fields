import { FieldActivatedSaga } from './field-activated/field-activated.saga';
import { FieldCreatedSaga } from './field-created/field-created.saga';
import { FieldDeactivatedSaga } from './field-deactivated/field-deactivated.saga';
import { FieldUpdatedSaga } from './field-updated/field-updated.saga';

export const Sagas = [FieldCreatedSaga, FieldActivatedSaga, FieldDeactivatedSaga, FieldUpdatedSaga];
