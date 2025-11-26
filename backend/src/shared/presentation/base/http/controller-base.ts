import { Result } from '@/shared/domain/base/result';

export abstract class HttpControllerBase {
  async rejectOrResolve<TResponse, TError extends Error>(
    callback: () => Promise<Result<TResponse, TError>>,
  ) {
    const response = await callback();
    if (response?.isFailure) {
      throw response?.getErrorValue();
    }
    return response?.getValue();
  }
}
