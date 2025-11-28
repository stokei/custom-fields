import { ExceptionCode } from '@/shared/domain/errors/base/exception-codes';
import { ValidationException } from '@/shared/domain/errors/base/validation-exception';

interface FieldOptionAlreadyExistsDetails {
  value: string;
}

export class FieldOptionAlreadyExistsException extends ValidationException<FieldOptionAlreadyExistsDetails> {
  private constructor(
    argumentName: string,
    details: FieldOptionAlreadyExistsDetails,
  ) {
    super(
      argumentName,
      `Option '${details.value}' already exists.`,
      ExceptionCode.FIELD_OPTION_ALREADY_EXISTS,
      [details],
    );
  }

  static create(
    argumentName: string,
    details: FieldOptionAlreadyExistsDetails,
  ): FieldOptionAlreadyExistsException {
    return new FieldOptionAlreadyExistsException(argumentName, details);
  }
}
