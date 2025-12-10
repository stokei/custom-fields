import { Query } from '@nestjs/common';

import { QueryParamMustBeBooleanException } from '@/shared/infra/http/errors/query-param-must-be-boolean';

export const QueryParamBoolean = (key: string) =>
  Query(key, {
    transform(value: any) {
      if (value === undefined || value === null) {
        return undefined;
      }
      if (value === 'true') return true;
      if (value === 'false') return false;
      throw QueryParamMustBeBooleanException.create(key, value);
    },
  });
