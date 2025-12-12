import { DomainException } from './domain-exception';
import { ExceptionCode } from './exception-codes';

export abstract class AlreadyExistsException extends DomainException {
  protected constructor(entityName: string, code: ExceptionCode, identifier?: string) {
    const details = identifier ? [{ identifier }] : undefined;

    super(`${entityName} already exists`, code, details);
  }
}
