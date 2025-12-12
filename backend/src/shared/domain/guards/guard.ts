export type GuardResponse = string;

import { Result } from '../base/result';
import { ArgumentArrayLengthNotEqualException } from '../errors/guards/argument-array-length-not-equal-exception';
import { ArgumentArrayMaxItemsException } from '../errors/guards/argument-array-max-items-exception';
import { ArgumentArrayMinItemsException } from '../errors/guards/argument-array-min-items-exception';
import { ArgumentEmptyArrayException } from '../errors/guards/argument-empty-array-exception';
import { ArgumentEmptyStringException } from '../errors/guards/argument-empty-string-exception';
import { ArgumentNullOrUndefinedException } from '../errors/guards/argument-null-or-undefined-exception';
import { NumberNotGreaterOrEqualThanException } from '../errors/guards/number-not-greater-or-equal-than-exception';
import { NumberNotGreaterThanException } from '../errors/guards/number-not-greater-than-exception';
import { NumberNotInRangeException } from '../errors/guards/number-not-in-range-exception';
import { NumbersNotAllInRangeException } from '../errors/guards/numbers-not-all-in-range-exception';
import { PatternNotMatchException } from '../errors/guards/pattern-not-match-exception';
import { TextTooLongException } from '../errors/guards/text-too-long-exception';
import { TextTooShortException } from '../errors/guards/text-too-short-exception';
import { ValueNotOneOfException } from '../errors/guards/value-not-one-of-exception';

export interface IGuardArgument {
  argument: any;
  argumentName: string;
}

export type GuardArgumentCollection = IGuardArgument[];

export class Guard {
  public static greaterThan(
    argumentName: string,
    minValue: number,
    actualValue: number,
  ): Result<GuardResponse> {
    return actualValue > minValue
      ? Result.ok<GuardResponse>()
      : Result.fail<GuardResponse>(
          NumberNotGreaterThanException.create(argumentName, {
            minValue,
            actualValue,
          }),
        );
  }

  public static greaterOrEqualThan(
    argumentName: string,
    minValue: number,
    actualValue: number,
  ): Result<GuardResponse> {
    return actualValue >= minValue
      ? Result.ok<GuardResponse>()
      : Result.fail<GuardResponse>(
          NumberNotGreaterOrEqualThanException.create(argumentName, {
            minValue,
            actualValue,
          }),
        );
  }

  public static againstAtLeast(
    argumentName: string,
    numChars: number,
    text: string,
  ): Result<GuardResponse> {
    return text.length >= numChars
      ? Result.ok<GuardResponse>()
      : Result.fail<GuardResponse>(
          TextTooShortException.create(argumentName, {
            minLength: numChars,
            actualLength: text.length,
          }),
        );
  }

  public static againstAtMost(
    argumentName: string,
    numChars: number,
    text: string,
  ): Result<GuardResponse> {
    if (text.length <= numChars) return Result.ok<GuardResponse>();
    return Result.fail<GuardResponse>(
      TextTooLongException.create(argumentName, {
        maxLength: numChars,
        actualLength: text.length,
      }),
    );
  }

  public static againstNullOrUndefined(argumentName: string, argument: any): Result<GuardResponse> {
    if (typeof argument === 'string') {
      return this.againstEmptyString(argumentName, argument);
    }
    if (argument === null || argument === undefined || argument === '') {
      return Result.fail<GuardResponse>(ArgumentNullOrUndefinedException.create(argumentName));
    }
    return Result.ok<GuardResponse>();
  }

  static againstEmptyString(argumentName: string, value: string): Result<GuardResponse> {
    if (!value?.trim?.()?.length) {
      return Result.fail<GuardResponse>(ArgumentEmptyStringException.create(argumentName));
    }
    return Result.ok<GuardResponse>();
  }

  static againstEmptyArray<TValue = string>(
    argumentName: string,
    values: TValue[],
  ): Result<GuardResponse> {
    if (!values?.length) {
      return Result.fail<GuardResponse>(ArgumentEmptyArrayException.create(argumentName));
    }
    return Result.ok<GuardResponse>();
  }

  static arrayLengthEqual<TValue = unknown>(
    argumentName: string,
    array: TValue[],
    expected: number,
  ): Result<GuardResponse> {
    if (!Array.isArray(array)) {
      return Result.fail<GuardResponse>(ArgumentNullOrUndefinedException.create(argumentName));
    }

    const actual = array.length;

    if (actual !== expected) {
      return Result.fail<GuardResponse>(
        ArgumentArrayLengthNotEqualException.create(argumentName, {
          expected,
          actual,
        }),
      );
    }

    return Result.ok<GuardResponse>();
  }

  static arrayMinLength<TValue = unknown>(
    argumentName: string,
    array: TValue[],
    min: number,
  ): Result<GuardResponse> {
    if (!Array.isArray(array)) {
      return Result.fail<GuardResponse>(ArgumentNullOrUndefinedException.create(argumentName));
    }

    const actual = array.length;

    if (actual < min) {
      return Result.fail<GuardResponse>(
        ArgumentArrayMinItemsException.create(argumentName, {
          min,
          actual,
        }),
      );
    }

    return Result.ok<GuardResponse>();
  }

  static arrayMaxLength<TValue = unknown>(
    argumentName: string,
    array: TValue[],
    max: number,
  ): Result<GuardResponse> {
    if (!Array.isArray(array)) {
      return Result.fail<GuardResponse>(ArgumentNullOrUndefinedException.create(argumentName));
    }

    const actual = array.length;

    if (actual > max) {
      return Result.fail<GuardResponse>(
        ArgumentArrayMaxItemsException.create(argumentName, {
          max,
          actual,
        }),
      );
    }

    return Result.ok<GuardResponse>();
  }

  static arrayLengthBetween<TValue = unknown>(
    argumentName: string,
    array: TValue[],
    min: number,
    max: number,
  ): Result<GuardResponse> {
    const checks = [
      this.arrayMinLength(argumentName, array, min),
      this.arrayMaxLength(argumentName, array, max),
    ];

    return this.combine(checks);
  }

  static matchRegex(argumentName: string, value: string, pattern: string): Result<GuardResponse> {
    const nullCheck = Guard.againstNullOrUndefined(argumentName, value);
    if (nullCheck.isFailure) return nullCheck;

    const patternCheck = Guard.againstNullOrUndefined(`${argumentName}.pattern`, pattern);
    if (patternCheck.isFailure) return patternCheck;

    let regex: RegExp;
    try {
      regex = new RegExp(pattern);
    } catch {
      return Result.fail<GuardResponse>(
        PatternNotMatchException.create(argumentName, {
          value,
          pattern,
        }),
      );
    }

    const matches = regex.test(value);
    if (!matches) {
      return Result.fail<GuardResponse>(
        PatternNotMatchException.create(argumentName, {
          value,
          pattern,
        }),
      );
    }

    return Result.ok<GuardResponse>();
  }

  public static isOneOf<TValue = any>(
    argumentName: string,
    value: TValue,
    validValues: TValue[],
  ): Result<GuardResponse> {
    const isValid = validValues.some((validValue) => validValue === value);
    if (isValid) {
      return Result.ok<GuardResponse>();
    }
    return Result.fail<GuardResponse>(
      ValueNotOneOfException.create<TValue>(argumentName, {
        value,
        validValues,
      }),
    );
  }

  public static inRange(
    argumentName: string,
    num: number,
    min: number,
    max: number,
  ): Result<GuardResponse> {
    const isInRange = num >= min && num <= max;
    if (!isInRange) {
      return Result.fail<GuardResponse>(
        NumberNotInRangeException.create(argumentName, { num, min, max }),
      );
    }
    return Result.ok<GuardResponse>();
  }

  public static allInRange(
    argumentName: string,
    numbers: number[],
    min: number,
    max: number,
  ): Result<GuardResponse> {
    for (const num of numbers) {
      const numIsInRangeResult = this.inRange(argumentName, num, min, max);
      if (numIsInRangeResult.isFailure) {
        return Result.fail<GuardResponse>(
          NumbersNotAllInRangeException.create(argumentName, {
            numbers,
            min,
            max,
          }),
        );
      }
    }

    return Result.ok<GuardResponse>();
  }

  public static againstNullOrUndefinedBulk(args: GuardArgumentCollection): Result<GuardResponse> {
    for (const arg of args) {
      const result = this.againstNullOrUndefined(arg.argumentName, arg.argument);
      if (result.isFailure) return result;
    }

    return Result.ok<GuardResponse>();
  }

  public static combine(guardResults: Result<any>[]): Result<GuardResponse> {
    for (const result of guardResults) {
      if (result.isFailure) return result;
    }

    return Result.ok<GuardResponse>();
  }
}
