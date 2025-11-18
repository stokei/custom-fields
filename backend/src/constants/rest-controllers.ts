export const REST_CONTROLLERS_URL_NAMES = {
  HEALTH_CHECKS: {
    BASE: 'status',
    STATUS: 'status',
  },
  FIELDS: {
    BASE: 'fields',
    CREATE_FIELD: 'groups/:groupId/fields',
    UPDATE_FIELD: 'groups/:groupId/fields/:fieldId',
    GET_FIELDS_BY_CONTEXT: 'groups/:groupId/fields/:context',
    DELETE_FIELD: 'groups/:groupId/fields/:fieldId',
  },
};
