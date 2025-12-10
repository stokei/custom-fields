import { Query } from '@nestjs/common';

import { QueryParamMustBeNumberException } from '@/shared/infra/http/errors/query-param-must-be-number';

export const QueryParamNumber = (key: string) =>
  Query(key, {
    transform(value: any) {
      if (value === undefined || value === null) {
        return undefined;
      }
      const parsed = Number(value);
      if (isNaN(parsed) || value === '' || (typeof value === 'string' && value.trim() === '')) {
        throw QueryParamMustBeNumberException.create(key, value);
      }
      return parsed;
    },
  });
