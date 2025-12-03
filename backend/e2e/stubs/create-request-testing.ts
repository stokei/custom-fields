import request from 'supertest';
import { AppTesting } from './create-testing-module';
import { tenantContextStub } from '@/tests/stubs/http/tenant-context.stub';
import {
  APIKEY_HEADER_NAME,
  ORGANIZATION_ID_HEADER_NAME,
} from '@/constants/rest-headers';

export const createRequestTesting = (app: AppTesting) => {
  const req = request(app.getHttpServer());
  return {
    post: (url: string) =>
      req
        .post(url)
        .set(APIKEY_HEADER_NAME, tenantContextStub.apiKey)
        .set(ORGANIZATION_ID_HEADER_NAME, tenantContextStub.organizationId),
    get: (url: string) =>
      req
        .get(url)
        .set(APIKEY_HEADER_NAME, tenantContextStub.apiKey)
        .set(ORGANIZATION_ID_HEADER_NAME, tenantContextStub.organizationId),
  };
};
