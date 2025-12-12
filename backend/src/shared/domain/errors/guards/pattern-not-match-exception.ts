import { ExceptionCode } from '../base/exception-codes';
import { ValidationException } from '../base/validation-exception';

interface PatternNotMatchExceptionDetails {
  value: string;
  pattern: string;
}

export class PatternNotMatchException extends ValidationException<PatternNotMatchExceptionDetails> {
  private constructor(argumentName: string, details: PatternNotMatchExceptionDetails) {
    super(
      argumentName,
      `Value "${details.value}" does not match pattern "${details.pattern}".`,
      ExceptionCode.PATTERN_NOT_MATCH,
      [details],
    );
  }

  static create(argumentName: string, details: PatternNotMatchExceptionDetails) {
    return new PatternNotMatchException(argumentName, details);
  }
}
