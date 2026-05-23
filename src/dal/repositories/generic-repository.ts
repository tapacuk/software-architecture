import * as fs from 'fs';
import * as path from 'path';

export class GenericRepository<T extends { id: string }> {
  protected items: T[] = [];
  private filePath: string;

  constructor(protected storageKey: string) {
    const dataDir = path.resolve(process.cwd(), 'data');

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    this.filePath = path.join(dataDir, `${this.storageKey}.json`);
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
    fs.writeFileSync(
      this.filePath,
      JSON.stringify(this.items, null, 2),
      'utf-8',
    );
  }

  protected loadFromStorage(): void {
    if (fs.existsSync(this.filePath)) {
      const data = fs.readFileSync(this.filePath, 'utf-8');
      this.items = JSON.parse(data);
    } else {
      this.items = [];
    }
  }
}
