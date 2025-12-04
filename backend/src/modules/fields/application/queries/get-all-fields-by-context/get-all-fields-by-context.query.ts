import { QueryBase } from '@/shared/application/base/query-base';

interface GetAllFieldsByContextDTO {
  tenantId: string;
  organizationId: string;
  context: string;
}

export class GetAllFieldsByContextQuery implements QueryBase, GetAllFieldsByContextDTO {
  tenantId: string;
  organizationId: string;
  context: string;

  constructor(data: GetAllFieldsByContextDTO) {
    this.tenantId = data.tenantId;
    this.organizationId = data.organizationId;
    this.context = data.context;
  }
}
