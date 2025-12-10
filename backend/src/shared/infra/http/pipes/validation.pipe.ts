import { ValidationPipe as NestValidationPipe } from '@nestjs/common';

import { ClassValidatorValidationException } from '../errors/class-validator-validation-exception';

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
        const error = ClassValidatorValidationException.create(details);
        return {
          ...error,
          message: error.messages,
        };
      },
    });
  }
}
