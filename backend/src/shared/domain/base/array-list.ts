export abstract class ArrayList<T> {
  private items: T[];

  constructor(initialItems?: T[]) {
    this.items = initialItems ? initialItems : [];
  }

  protected abstract compareItems(a: T, b: T): boolean;
  protected abstract sortBy(a: T, b: T): 1 | 0 | -1;

  public getItems(filter?: (value: T, index: number, array: T[]) => boolean): T[] {
    if (!filter) return this.items;
    return this.items.filter(filter);
  }
  public getItemBy(filter?: (value: T, index: number, array: T[]) => boolean): T | undefined {
    if (!filter) return;
    return this.items.find(filter);
  }

  public size(): number {
    return this.items.length;
  }

  public sort(): void {
    this.items.sort((a, b) => this.sortBy(a, b));
  }

  public isEmpty(): boolean {
    return !this.size();
  }

  public exists(item: T): boolean {
    return !!this.getItemBy((currentItem) => this.compareItems(item, currentItem));
  }

  public add(item: T): void {
    if (!this.exists(item)) {
      this.items.push(item);
    }
  }

  public remove(removedItem: T): void {
    if (this.exists(removedItem)) {
      this.items.filter((item) => this.compareItems(item, removedItem));
    }
  }

  public update(updatedItem: T): void {
    if (this.exists(updatedItem)) {
      this.items = this.items.map((item) => {
        const isCurrentItem = this.compareItems(item, updatedItem);
        if (isCurrentItem) {
          return updatedItem;
        }
        return item;
      });
    }
  }
}
