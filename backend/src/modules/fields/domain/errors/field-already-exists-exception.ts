import { ExceptionCode } from '@/shared/domain/errors/base/exception-codes';
import { ValidationException } from '@/shared/domain/errors/base/validation-exception';

interface FieldAlreadyExistsDetails {
  context: string;
  organizationId: string;
  key: string;
}

export class FieldAlreadyExistsException extends ValidationException<FieldAlreadyExistsDetails> {
  private constructor(details: FieldAlreadyExistsDetails) {
    super(
      'Field',
      `key "${details.key}" already exists in organization "${details.organizationId}" and context "${details.context}".`,
      ExceptionCode.FIELD_ALREADY_EXISTS,
      [details],
    );
  }

  static create(details: FieldAlreadyExistsDetails): FieldAlreadyExistsException {
    return new FieldAlreadyExistsException(details);
  }
}
