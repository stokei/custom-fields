export const REST_CONTROLLERS_URL_NAMES = {
  HEALTH_CHECKS: {
    DOCUMENTATION_TITLE: 'Status',
    BASE: '/status',
    STATUS: '/status',
  },
  FIELDS: {
    DOCUMENTATION_TITLE: 'Fields',
    BASE: '/fields',
    CREATE_FIELD: '/fields',
    UPDATE_FIELD: '/fields/:fieldId',
    GET_ALL_FIELDS_BY_CONTEXT: '/fields/:context',
    DELETE_FIELD: '/fields/:fieldId',
  },
  FIELD_VALUES: {
    DOCUMENTATION_TITLE: 'Field Values',
    BASE: '/field-values',
    GET_VALUES: '/field-values/:context/:entityId',
    UPSERT_VALUES: '/field-values/:context/:entityId',
  },
};
