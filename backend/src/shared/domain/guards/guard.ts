export type GuardResponse = string;

import { Result } from '../base/result';

export interface IGuardArgument {
  argument: any;
  argumentName: string;
}

export type GuardArgumentCollection = IGuardArgument[];

export class Guard {
  public static combine(guardResults: Result<any>[]): Result<GuardResponse> {
    for (const result of guardResults) {
      if (result.isFailure) return result;
    }

    return Result.ok<GuardResponse>();
  }

  public static greaterThan(
    minValue: number,
    actualValue: number,
  ): Result<GuardResponse> {
    return actualValue > minValue
      ? Result.ok<GuardResponse>()
      : Result.fail<GuardResponse>(
        new Error(
          `Number given {${actualValue}} is not greater than {${minValue}}`,
        ),
      );
  }
  public static greaterOrEqualThan(
    minValue: number,
    actualValue: number,
  ): Result<GuardResponse> {
    return actualValue >= minValue
      ? Result.ok<GuardResponse>()
      : Result.fail<GuardResponse>(
        new Error(
          `Number given {${actualValue}} is not greater or equal than {${minValue}}`,
        ),
      );
  }

  public static againstAtLeast(
    numChars: number,
    text: string,
  ): Result<GuardResponse> {
    return text.length >= numChars
      ? Result.ok<GuardResponse>()
      : Result.fail<GuardResponse>(
        new Error(`Text is not at least ${numChars} chars.`),
      );
  }

  public static againstAtMost(
    numChars: number,
    text: string,
  ): Result<GuardResponse> {
    if (text.length <= numChars) return Result.ok<GuardResponse>();
    return Result.fail<GuardResponse>(
      new Error(`Text is greater than ${numChars} chars.`),
    );
  }

  public static againstNullOrUndefined(
    argument: any,
    argumentName: string,
  ): Result<GuardResponse> {
    if (argument === null || argument === undefined || argument === '') {
      return Result.fail<GuardResponse>(
        new Error(`${argumentName} is null or undefined`),
      );
    }
    return Result.ok<GuardResponse>();
  }

  public static againstNullOrUndefinedBulk(
    args: GuardArgumentCollection,
  ): Result<GuardResponse> {
    for (const arg of args) {
      const result = this.againstNullOrUndefined(
        arg.argument,
        arg.argumentName,
      );
      if (result.isFailure) return result;
    }

    return Result.ok<GuardResponse>();
  }

  static againstEmptyString(
    value: string,
    name: string,
  ): Result<GuardResponse> {
    if (value.trim().length === 0)
      Result.fail<GuardResponse>(new Error(`Guard: ${name} is empty`));
    return Result.ok<GuardResponse>();
  }

  public static isOneOf(
    value: any,
    validValues: any[],
    argumentName: string,
  ): Result<GuardResponse> {
    const isValid = validValues.some((validValue) => validValue === value);
    if (isValid) {
      return Result.ok<GuardResponse>();
    }
    return Result.fail<GuardResponse>(
      new Error(
        `${argumentName} isn't oneOf the correct types in ${JSON.stringify(validValues)}. Got "${value}".`,
      ),
    );
  }

  public static inRange(
    num: number,
    min: number,
    max: number,
    argumentName: string,
  ): Result<GuardResponse> {
    const isInRange = num >= min && num <= max;
    if (!isInRange) {
      return Result.fail<GuardResponse>(
        new Error(`${argumentName} is not within range ${min} to ${max}.`),
      );
    }
    return Result.ok<GuardResponse>();
  }

  public static allInRange(
    numbers: number[],
    min: number,
    max: number,
    argumentName: string,
  ): Result<GuardResponse> {
    let failingResult: Result<GuardResponse> = new Result(false, new Error(''));

    for (const num of numbers) {
      const numIsInRangeResult = this.inRange(num, min, max, argumentName);
      if (!numIsInRangeResult.isFailure) failingResult = numIsInRangeResult;
    }

    if (failingResult) {
      return Result.fail<GuardResponse>(
        new Error(`${argumentName} is not within the range.`),
      );
    }
    return Result.ok<GuardResponse>();
  }
}
