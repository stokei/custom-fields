import { AlreadyExistsException } from '@/shared/domain/errors/base/already-exists-exception';
import { ExceptionCode } from '@/shared/domain/errors/base/exception-codes';

export class PrismaResourceAlreadyExistsException extends AlreadyExistsException {
  private constructor(resourceName: string) {
    super(resourceName, ExceptionCode.UNIQUE_CONSTRAINT);
  }

  static create(resourceName: string) {
    return new PrismaResourceAlreadyExistsException(resourceName);
  }
}
