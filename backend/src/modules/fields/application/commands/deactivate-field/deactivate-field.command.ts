import { CommandBase } from '@/shared/application/base/command-base';

interface DeactivateFieldDTO {
  tenantId: string;
  organizationId: string;
  context: string;
  key: string;
}

export class DeactivateFieldCommand implements CommandBase, DeactivateFieldDTO {
  tenantId: string;
  organizationId: string;
  context: string;
  key: string;

  constructor(data: DeactivateFieldDTO) {
    this.tenantId = data.tenantId;
    this.organizationId = data.organizationId;
    this.context = data.context;
    this.key = data.key;
  }
}
