import { ValidationException } from '@/shared/domain/errors/base/validation-exception';

interface FieldOptionAlreadyExistsDetails {
  value: string;
}

export class FieldOptionAlreadyExistsException extends ValidationException<FieldOptionAlreadyExistsDetails> {
  private constructor(details: FieldOptionAlreadyExistsDetails) {
    super(
      `Option '${details.value}' already exists.`,
      'FIELD_OPTION_ALREADY_EXISTS',
      details,
    );
  }

  static create(
    details: FieldOptionAlreadyExistsDetails,
  ): FieldOptionAlreadyExistsException {
    return new FieldOptionAlreadyExistsException(details);
  }
}
