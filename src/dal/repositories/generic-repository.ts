import type { IRepository } from './interfaces';

export class GenericRepository<
  T extends { id: string },
> implements IRepository<T> {
  protected items: T[] = [];

  getAll(): T[] {
    return this.items;
  }

  getById(id: string): T | undefined {
    return this.items.find((item) => item.id === id);
  }

  add(item: T): void {
    this.items.push(item);
  }

  update(item: T): void {
    const index = this.items.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      this.items[index] = item;
    }
  }

  delete(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
  }
}
