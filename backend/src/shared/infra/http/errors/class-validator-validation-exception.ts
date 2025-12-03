import { ExceptionCode } from '@/shared/domain/errors/base/exception-codes';
import { ValidationException } from '@/shared/domain/errors/base/validation-exception';

interface ClassValidatorValidationExceptionDetails {
  field: string;
  value: any;
  constraints: Record<string, string> | undefined;
}
export class ClassValidatorValidationException extends ValidationException<ClassValidatorValidationExceptionDetails> {
  public messages: string[];
  private constructor(
    message: string[],
    details?: ClassValidatorValidationExceptionDetails[],
  ) {
    super('', message, ExceptionCode.VALIDATION_ERROR, details);
    this.messages = message;
  }

  public static create(details: ClassValidatorValidationExceptionDetails[]) {
    const messages = details
      .filter((detail) => !!detail.constraints)
      .flatMap((detail) =>
        Object.values(detail.constraints || {}).map(
          (constraint) => `[${detail.field}] ${constraint}`,
        ),
      );
    return new ClassValidatorValidationException(messages, details);
  }
}
