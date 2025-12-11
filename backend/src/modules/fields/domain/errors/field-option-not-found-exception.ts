import { NotFoundException } from '@/shared/domain/errors/base/not-found-exception';

export class FieldOptionNotFoundException extends NotFoundException {
  private constructor(value: string) {
    super('FieldOption', value);
  }

  static create(value: string): FieldOptionNotFoundException {
    return new FieldOptionNotFoundException(value);
  }
}
