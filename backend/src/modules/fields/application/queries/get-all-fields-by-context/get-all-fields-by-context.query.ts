import { QueryBase } from '@/shared/application/base/query-base';

interface GetAllFieldsByContextFiltersDTO {
  activeOnly: boolean;
}

interface GetAllFieldsByContextDTO {
  tenantId: string;
  organizationId: string;
  context: string;
  filters?: GetAllFieldsByContextFiltersDTO;
}

export class GetAllFieldsByContextQuery implements QueryBase, GetAllFieldsByContextDTO {
  tenantId: string;
  organizationId: string;
  context: string;
  filters?: GetAllFieldsByContextFiltersDTO;

  constructor(data: GetAllFieldsByContextDTO) {
    this.tenantId = data.tenantId;
    this.organizationId = data.organizationId;
    this.context = data.context;
    this.filters = data.filters;
  }
}
