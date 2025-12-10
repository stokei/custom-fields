import { ExceptionCode } from '@/shared/domain/errors/base/exception-codes';
import { NotFoundException } from '@/shared/domain/errors/base/not-found-exception';

export class PrismaRecordNotFoundException extends NotFoundException {
  private constructor(recordName: string) {
    super(recordName, ExceptionCode.RECORD_NOT_FOUND);
  }

  static create(recordName: string) {
    return new PrismaRecordNotFoundException(recordName);
  }
}
