import { DomainException } from './domain-exception';
import { ExceptionCode } from './exception-codes';

export class NotFoundException extends DomainException {
  protected constructor(
    entityName: string,
    identifier: string | Record<string, unknown>,
  ) {
    const details =
      typeof identifier === 'string' ? { id: identifier } : identifier;

    super(`${entityName} not found`, ExceptionCode.NOT_FOUND, [details]);
  }
}
