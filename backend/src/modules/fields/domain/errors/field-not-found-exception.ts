import { NotFoundException } from '@/shared/domain/errors/base/not-found-exception';

export class FieldNotFoundException extends NotFoundException {
  private constructor(key: string) {
    super('field', key);
  }

  static create(key: string): FieldNotFoundException {
    return new FieldNotFoundException(key);
  }
}
