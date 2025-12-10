import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { QueryBase } from '@/shared/application/base/query-base';

@Injectable()
export class QueryBusService<TQuery extends QueryBase, TResponse> {
  constructor(private readonly queryBus: QueryBus) {}

  async execute(query: TQuery): Promise<TResponse> {
    return await this.queryBus.execute(query);
  }
}
