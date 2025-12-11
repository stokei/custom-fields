export const REST_CONTROLLERS_URL_NAMES = {
  HEALTH_CHECKS: {
    DOCUMENTATION_TITLE: 'Status',
    BASE: '/status',
    STATUS: '/status',
  },
  FIELDS: {
    DOCUMENTATION_TITLE: 'Fields',
    BASE: '/fields',
    CREATE_FIELD: '/fields/:context',
    GET_ALL_FIELDS_BY_CONTEXT: '/fields/:context',
    UPDATE_FIELD: '/fields/:context/:key',
    ACTIVATE_FIELD: '/fields/:context/:key/activate',
    DEACTIVATE_FIELD: '/fields/:context/:key/deactivate',
    OPTIONS: {
      DOCUMENTATION_TITLE: 'Field Options',
      BASE: '/fields/:context/:key/options',
      CREATE_FIELD_OPTION: '/fields/:context/:key/options',
      UPDATE_FIELD_OPTION: '/fields/:context/:key/options',
      ACTIVATE_FIELD_OPTION: '/fields/:context/:key/options/:value/activate',
      DEACTIVATE_FIELD_OPTION: '/fields/:context/:key/options/:value/deactivate',
    },
  },
  FIELD_VALUES: {
    DOCUMENTATION_TITLE: 'Field Values',
    BASE: '/field-values',
    GET_VALUES: '/field-values/:context/:entityId',
    UPSERT_VALUES: '/field-values/:context/:entityId',
  },
};
