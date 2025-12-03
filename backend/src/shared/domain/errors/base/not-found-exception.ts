import { HttpStatus } from '@nestjs/common';
import { DomainException } from './domain-exception';
import { ExceptionCode } from './exception-codes';
import { ExceptionType } from './exception-types';

export abstract class NotFoundException extends DomainException {
  public readonly type: ExceptionType;
  public static readonly TYPE: ExceptionType = ExceptionType.NOT_FOUND;
  public static readonly HTTP_STATUS_CODE: HttpStatus = HttpStatus.NOT_FOUND;
  protected constructor(
    entityName: string,
    identifier: string | Record<string, unknown>,
  ) {
    const details =
      typeof identifier === 'string' ? { id: identifier } : identifier;

    super(`${entityName} not found`, ExceptionCode.NOT_FOUND, [details]);

    this.type = NotFoundException.TYPE;
  }
}
