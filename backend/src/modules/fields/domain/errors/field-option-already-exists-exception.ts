import { ExceptionCode } from '@/shared/domain/errors/base/exception-codes';
import { ValidationException } from '@/shared/domain/errors/base/validation-exception';

interface FieldOptionAlreadyExistsDetails {
  label: string;
  value: string;
  order?: number;
}

export class FieldOptionAlreadyExistsException extends ValidationException<FieldOptionAlreadyExistsDetails> {
  private constructor(details: FieldOptionAlreadyExistsDetails) {
    super(
      'FieldOption',
      `Option '${details.value}' already exists.`,
      ExceptionCode.FIELD_OPTION_ALREADY_EXISTS,
      [details],
    );
  }

  static create(details: FieldOptionAlreadyExistsDetails): FieldOptionAlreadyExistsException {
    return new FieldOptionAlreadyExistsException(details);
  }
}
