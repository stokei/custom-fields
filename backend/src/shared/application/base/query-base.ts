import { IQuery } from '@nestjs/cqrs';

export type QueryBase = IQuery;

export abstract class QueryHandlerBase<
  TQuery extends QueryBase,
  TResponse = any,
> {
  abstract execute(query: TQuery): TResponse;
}
