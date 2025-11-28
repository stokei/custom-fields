import { ExceptionCode } from '@/shared/domain/errors/base/exception-codes';
import { ValidationException } from '@/shared/domain/errors/base/validation-exception';
import { ValidationPipe as NestValidationPipe } from '@nestjs/common';

class ClassValidatorValidationException extends ValidationException {
  constructor(message: string[], details?: any) {
    super('', message, ExceptionCode.VALIDATION_ERROR, details);
  }
}

export class ClassValidatiorValidationPipe {
  public static create() {
    return new NestValidationPipe({
      transform: true,
      exceptionFactory(errors) {
        const details = errors.map((err) => ({
          field: err.property,
          value: err.value,
          constraints: err.constraints,
        }));
        const messages = details
          .filter((detail) => !!detail.constraints)
          .map(
            (detail) =>
              `[${detail.field}] ${Object.values(detail.constraints || {}).join(', ')}`,
          );
        const error = new ClassValidatorValidationException(messages, details);
        error.message = messages as any;
        return error;
      },
    });
  }
}
