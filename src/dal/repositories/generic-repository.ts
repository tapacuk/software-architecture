import type { IRepository } from './interfaces';

export class GenericRepository<
  T extends { id: string },
> implements IRepository<T> {
  protected items: T[] = [];

  constructor(protected storageKey: string) {
    this.loadFromStorage();
  }

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

  public saveChanges(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.items));
  }

  protected loadFromStorage(): void {
    const data = localStorage.getItem(this.storageKey);
    if (data) {
      this.items = JSON.parse(data);
    }
  }
}
