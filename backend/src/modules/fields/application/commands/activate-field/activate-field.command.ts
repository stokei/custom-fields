import { CommandBase } from '@/shared/application/base/command-base';

interface ActivateFieldDTO {
  tenantId: string;
  organizationId: string;
  context: string;
  key: string;
}

export class ActivateFieldCommand implements CommandBase, ActivateFieldDTO {
  tenantId: string;
  organizationId: string;
  context: string;
  key: string;

  constructor(data: ActivateFieldDTO) {
    this.tenantId = data.tenantId;
    this.organizationId = data.organizationId;
    this.context = data.context;
    this.key = data.key;
  }
}
