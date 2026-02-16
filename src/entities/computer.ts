import { BaseDevice } from './base-device';
import type { Task } from './task';

export class Computer extends BaseDevice {
  constructor(brand: string) {
    super(brand);
  }

  override performTask(task: Task, time: number): void {
    if (!this.hasElectricity) {
      console.log(`Computer ${this.brand} doesnt boot up: no power!`);
      return;
    }
    super.performTask(task, time);
  }
}
