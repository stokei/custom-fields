import { Inject } from '@nestjs/common';

export interface ApiKeyVerificationSuccess {
  valid: true;
  tenantId: string;
}

export interface ApiKeyVerificationFailure {
  valid: false;
}

export type ApiKeyVerificationResult =
  | ApiKeyVerificationSuccess
  | ApiKeyVerificationFailure;

export interface ApiKeyVerifier {
  verify(apiKey: string): Promise<ApiKeyVerificationResult>;
}

export const API_KEY_VERIFIER = 'API_KEY_VERIFIER';
export const InjectApiKeyVerifier = () => Inject(API_KEY_VERIFIER);
