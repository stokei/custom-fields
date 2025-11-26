export class Result<TValue, TError extends Error = Error> {
  public isSuccess: boolean;
  public isFailure: boolean;
  private error?: TError;
  private _value: TValue;

  public constructor(isSuccess: boolean, error?: TError, value?: TValue) {
    if (isSuccess && error) {
      throw new Error(
        'InvalidOperation: A result cannot be successful and contain an error',
      );
    }
    if (!isSuccess && !error) {
      throw new Error(
        'InvalidOperation: A failing result needs to contain an error message',
      );
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;
    this._value = value as TValue;

    Object.freeze(this);
  }

  public getValue(): TValue {
    if (!this.isSuccess) {
      throw new Error(
        "Can't get the value of an error result. Use 'errorValue' instead.",
      );
    }

    return this._value;
  }

  public getErrorValue(): TError {
    return this.error as TError;
  }

  public static ok<TValue, TError extends Error = Error>(
    value?: TValue,
  ): Result<TValue> {
    return new Result<TValue, TError>(true, undefined, value);
  }

  public static fail<TValue, TError extends Error = Error>(
    error: TError,
  ): Result<TValue, TError> {
    return new Result<TValue, TError>(false, error);
  }

  public static combine(results: Result<any>[]): Result<any> {
    for (const result of results) {
      if (result.isFailure) return result;
    }
    return Result.ok();
  }
}
