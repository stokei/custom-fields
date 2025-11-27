export type GuardResponse = string;

import { Result } from '../base/result';
import { ArgumentEmptyStringException } from '../errors/guards/argument-empty-string-exception';
import { ArgumentNullOrUndefinedException } from '../errors/guards/argument-null-or-undefined-exception';
import { NumberNotGreaterOrEqualThanException } from '../errors/guards/number-not-greater-or-equal-than-exception';
import { NumberNotGreaterThanException } from '../errors/guards/number-not-greater-than-exception';
import { NumberNotInRangeException } from '../errors/guards/number-not-in-range-exception';
import { NumbersNotAllInRangeException } from '../errors/guards/numbers-not-all-in-range-exception';
import { TextTooLongException } from '../errors/guards/text-too-long-exception';
import { TextTooShortException } from '../errors/guards/text-too-short-exception';
import { ValueNotOneOfException } from '../errors/guards/value-not-one-of-exception';

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
        NumberNotGreaterThanException.create(minValue, actualValue),
      );
  }

  public static greaterOrEqualThan(
    minValue: number,
    actualValue: number,
  ): Result<GuardResponse> {
    return actualValue >= minValue
      ? Result.ok<GuardResponse>()
      : Result.fail<GuardResponse>(
        NumberNotGreaterOrEqualThanException.create(minValue, actualValue),
      );
  }

  public static againstAtLeast(
    numChars: number,
    text: string,
  ): Result<GuardResponse> {
    return text.length >= numChars
      ? Result.ok<GuardResponse>()
      : Result.fail<GuardResponse>(
        TextTooShortException.create(numChars, text.length),
      );
  }

  public static againstAtMost(
    numChars: number,
    text: string,
  ): Result<GuardResponse> {
    if (text.length <= numChars) return Result.ok<GuardResponse>();
    return Result.fail<GuardResponse>(
      TextTooLongException.create(numChars, text.length),
    );
  }

  public static againstNullOrUndefined(
    argument: any,
    argumentName: string,
  ): Result<GuardResponse> {
    if (argument === null || argument === undefined || argument === '') {
      return Result.fail<GuardResponse>(
        ArgumentNullOrUndefinedException.create(argumentName),
      );
    }
    return Result.ok<GuardResponse>();
  }

  static againstEmptyString(
    value: string,
    name: string,
  ): Result<GuardResponse> {
    if (value.trim().length === 0) {
      return Result.fail<GuardResponse>(
        ArgumentEmptyStringException.create(name),
      );
    }
    return Result.ok<GuardResponse>();
  }

  public static isOneOf<TValue = any>(
    value: TValue,
    validValues: TValue[],
    argumentName: string,
  ): Result<GuardResponse> {
    const isValid = validValues.some((validValue) => validValue === value);
    if (isValid) {
      return Result.ok<GuardResponse>();
    }
    return Result.fail<GuardResponse>(
      ValueNotOneOfException.create(argumentName, value, validValues),
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
        NumberNotInRangeException.create(argumentName, num, min, max),
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
    for (const num of numbers) {
      const numIsInRangeResult = this.inRange(num, min, max, argumentName);
      if (numIsInRangeResult.isFailure) {
        return Result.fail<GuardResponse>(
          NumbersNotAllInRangeException.create(argumentName, numbers, min, max),
        );
      }
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
}
