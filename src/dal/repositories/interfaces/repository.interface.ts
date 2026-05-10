export interface IRepository<T> {
  getAll(): T[];
  getById(id: string): T | undefined;
  add(item: T): void;
  update(item: T): void;
  delete(id: string): void;
}
