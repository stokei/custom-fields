import {
  FieldRepository,
  InjectFieldRepository,
} from '@/modules/fields/domain/repositories/field.repository';
import { QueryHandlerBase } from '@/shared/application/base/query-base';
import { Result } from '@/shared/domain/base/result';
import { QueryHandler } from '@nestjs/cqrs';
import { GetAllFieldsByContextQuery } from './get-all-fields-by-context.query';
import { GetAllFieldsByContextViewModel } from '../../viewmodels/get-all-fields-by-context/get-all-fields-by-context.viewmodel';
import { Guard } from '@/shared/domain/guards/guard';

export type GetAllFieldsByContextQueryResponse = Result<GetAllFieldsByContextViewModel>;
@QueryHandler(GetAllFieldsByContextQuery)
export class GetAllFieldsByContextHandler extends QueryHandlerBase<
  GetAllFieldsByContextQuery,
  Promise<GetAllFieldsByContextQueryResponse>
> {
  constructor(
    @InjectFieldRepository()
    private readonly fieldRepository: FieldRepository,
  ) {
    super();
  }

  async execute(query: GetAllFieldsByContextQuery) {
    try {
      const guardResult = Guard.combine([
        Guard.againstNullOrUndefined('tenantId', query.tenantId),
        Guard.againstNullOrUndefined('organizationId', query.organizationId),
        Guard.againstNullOrUndefined('context', query.context),
      ]);
      if (guardResult.isFailure) {
        throw guardResult.getErrorValue();
      }
      const fields = await this.fieldRepository.getAllByTenantContext({
        tenantId: query.tenantId,
        organizationId: query.organizationId,
        context: query.context,
      });
      return Result.ok<GetAllFieldsByContextViewModel>(
        GetAllFieldsByContextViewModel.create(query.context, fields),
      );
    } catch (error) {
      return Result.fail<GetAllFieldsByContextViewModel>(error);
    }
  }
}
