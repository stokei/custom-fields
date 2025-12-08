import { CommandBase } from '@/shared/application/base/command-base';

interface RemoveFieldDTO {
  tenantId: string;
  organizationId: string;
  context: string;
  key: string;
}

export class RemoveFieldCommand implements CommandBase, RemoveFieldDTO {
  tenantId: string;
  organizationId: string;
  context: string;
  key: string;

  constructor(data: RemoveFieldDTO) {
    this.tenantId = data.tenantId;
    this.organizationId = data.organizationId;
    this.context = data.context;
    this.key = data.key;
  }
}
