export class Guard {
  static againstNullOrUndefined(value: any, name: string): void {
    if (value === null || value === undefined)
      throw new Error(`Guard: ${name} is null or undefined`);
  }

  static againstEmptyString(value: string, name: string): void {
    if (value.trim().length === 0) throw new Error(`Guard: ${name} is empty`);
  }
}
