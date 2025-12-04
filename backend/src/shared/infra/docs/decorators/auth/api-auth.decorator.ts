import { applyDecorators } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';

export const ApiWithTenantAuth = () => applyDecorators(ApiSecurity('ApiKeyAuth'));
