import { DomainException } from './domain-exception';

export class NotFoundException extends DomainException {
  protected constructor(
    entityName: string,
    identifier: string | Record<string, unknown>,
  ) {
    const details =
      typeof identifier === 'string' ? { id: identifier } : identifier;

    super(
      `${entityName} not found`,
      `${entityName.toUpperCase()}_NOT_FOUND`,
      details,
    );
  }
}
