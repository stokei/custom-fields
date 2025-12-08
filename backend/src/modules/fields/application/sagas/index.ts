import { FieldCreatedSaga } from './field-created/field-created.saga';
import { FieldRemovedSaga } from './field-removed/field-removed.saga';
import { FieldUpdatedSaga } from './field-updated/field-updated.saga';

export const Sagas = [FieldCreatedSaga, FieldRemovedSaga, FieldUpdatedSaga];
