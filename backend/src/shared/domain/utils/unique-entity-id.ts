import { randomUUID } from 'crypto';

export class UniqueEntityID {
  private readonly _value: string;

  constructor(id?: string) {
    this._value = id ?? randomUUID();
  }

  toString(): string {
    return this._value;
  }

  equals(id?: UniqueEntityID): boolean {
    if (!id) return false;
    return id._value === this._value;
  }
}
