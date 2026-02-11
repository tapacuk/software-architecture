import { BaseDevice } from './base-device';
import type { Task } from './task';
import type { UsageIntensity } from './types/usage-intensity.type';

export class Computer extends BaseDevice {
  constructor(brand: string) {
    super(brand);
  }

  override performTask(
    task: Task,
    time: number,
    intensity: UsageIntensity,
    needsNetwork: boolean,
    needsAudio: boolean,
  ): void {
    if (!this.hasElectricity) {
      console.log(`Computer ${this.brand} doesnt boot up: no power!`);
      return;
    }
    super.performTask(task, time, intensity, needsNetwork, needsAudio);
  }
}
