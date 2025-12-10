import { Query } from '@nestjs/common';

export const QueryParam = (key: string) => Query(key);
